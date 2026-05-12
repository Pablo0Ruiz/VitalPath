import { Injectable, Logger } from '@nestjs/common';
import type { ModelMessage } from 'ai';
import axios from 'axios';
import type { Response } from 'express';
import { UserRoles } from 'src/auth/enum/user-role.enum';
import { GroqToolsService } from 'src/groq-tools/groq-tools.service';
import { ChatPromptDto } from './dto/chat-prompt.dto';
import { chatPromptStreamUseCase } from './use-cases/chat-prompt-use-case';

import { chatPromptUseCase } from './use-cases/chat-prompt-voice-use-case';
import { resumenPdf } from './use-cases/resumen-pdf-use-case';

import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Conversation } from './entities/conversation.entity';
import { nextMonday } from './helpers/date.helpers';

@Injectable()
export class GroqService {
  private readonly logger = new Logger(GroqService.name);

  constructor(
    private readonly groqToolsService: GroqToolsService,
    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<Conversation>,
  ) {}

  async chatStream(
    chatPromptDto: ChatPromptDto,
    userId: string,
    role: UserRoles,
    res: Response,
  ): Promise<void> {
    const history = await this.getChatHistory(chatPromptDto.chatId);

    const newMessages = await chatPromptStreamUseCase({
      chatPromptDto,
      groqToolsService: this.groqToolsService,
      userId,
      role,
      history,
      res,
    });

    await this.saveChatHistory(
      chatPromptDto.chatId,
      userId,
      [...history, ...newMessages],
      chatPromptDto.prompt,
    );
  }

  async voiceChat(
    chatPromptDto: ChatPromptDto,
    userId: string,
    role: UserRoles,
  ): Promise<{ transcript: string; replyText: string }> {
    const history = await this.getChatHistory(chatPromptDto.chatId);

    const { transcript, replyText, messages } = await chatPromptUseCase({
      chatPromptDto,
      groqToolsService: this.groqToolsService,
      userId,
      role,
      history,
    });

    await this.saveChatHistory(
      chatPromptDto.chatId,
      userId,
      [...history, ...messages],
      transcript,
    );

    return { transcript, replyText };
  }

  async transcribe(file: Express.Multer.File): Promise<string> {
    const formData = new FormData();
    const blob = new Blob([new Uint8Array(file.buffer)], {
      type: file.mimetype,
    });
    formData.append('file', blob, file.originalname);
    formData.append('model', 'whisper-large-v3');
    formData.append('language', 'es');

    try {
      const { data } = await axios.post(
        'https://api.groq.com/openai/v1/audio/transcriptions',
        formData,
        {
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          },
        },
      );

      return data.text;
    } catch (error) {
      this.logger.error(
        'Transcription error:' + (error.response?.data || error.message),
      );
      throw new Error('Falló la transcripción del audio');
    }
  }

  async getChatHistory(chatId: string): Promise<ModelMessage[]> {
    const conversation = await this.conversationModel.findOne({ chatId });
    if (!conversation) return [];

    return (conversation.messages as Record<string, unknown>[]).map(msg => {
      const role = msg.role as string;
      const sanitized: Record<string, unknown> = { role };

      if (Array.isArray(msg.content)) {
        sanitized.content = (msg.content as Record<string, unknown>[]).map(
          part => {
            const newPart = { ...part };

            if (newPart.providerOptions === null)
              delete newPart.providerOptions;

            if (newPart.type === 'tool-result') {
              newPart.result = newPart.result ?? newPart.output ?? {};
              if (newPart.output === null) delete newPart.output;
            }

            if (newPart.type === 'tool-call') {
              newPart.args = newPart.args ?? newPart.input ?? {};
              if (newPart.input === null) delete newPart.input;
              if (newPart.providerExecuted === null)
                delete newPart.providerExecuted;

              if (newPart.args === null) newPart.args = {};
            }

            return newPart;
          },
        );
      } else {
        sanitized.content = msg.content || '';
      }

      if (msg.toolCalls && Array.isArray(msg.toolCalls)) {
        sanitized.toolCalls = msg.toolCalls.map(
          (tc: Record<string, unknown>) => ({
            ...tc,
            args: tc.args ?? (tc.input as object) ?? {},
          }),
        );
      }

      return sanitized as unknown as ModelMessage;
    });
  }

  async saveChatHistory(
    chatId: string,
    userId: string,
    messages: ModelMessage[],
    firstPrompt: string,
  ): Promise<void> {
    const lastMsg = messages[messages.length - 1];
    let lastMessageText = '';

    if (typeof lastMsg?.content === 'string') {
      lastMessageText = lastMsg.content;
    } else if (Array.isArray(lastMsg?.content)) {
      const textPart = lastMsg.content.find(
        (p): p is { type: 'text'; text: string } =>
          'type' in p && p.type === 'text' && 'text' in p,
      );
      lastMessageText = textPart?.text || 'Archivo o Herramienta';
    }

    const userObjectId = new Types.ObjectId(userId);
    this.logger.log(
      `[GroqService] Guardando historia para chatId: ${chatId}, userId: ${userId} (as ObjectId: ${userObjectId})`,
    );

    await this.conversationModel.findOneAndUpdate(
      { chatId },
      {
        $set: {
          messages,
          lastMessage: lastMessageText,
          userId: userObjectId,
          expireAt: nextMonday(),
        },
        $setOnInsert: {
          title:
            firstPrompt.length > 40
              ? firstPrompt.substring(0, 40) + '...'
              : firstPrompt,
        },
      },
      { upsert: true, returnDocument: 'after' },
    );
  }

  async getUserConversations(userId: string): Promise<Conversation[]> {
    try {
      this.logger.log(
        `[GroqService] Buscando conversaciones para userId: ${userId}`,
      );
      const userObjectId = new Types.ObjectId(userId);

      const conversations = await this.conversationModel
        .find({ userId: userObjectId })
        .sort({ updatedAt: -1 })
        .exec();

      this.logger.log(
        `[GroqService] Encontradas ${conversations.length} conversaciones para el usuario ${userId}`,
      );
      return conversations;
    } catch (error) {
      this.logger.error('[GroqService] Error en getUserConversations:', error);

      return this.conversationModel
        .find({ userId: userId as unknown })
        .sort({ updatedAt: -1 })
        .exec();
    }
  }

  async resumenResultadoEstudio(base64Data: string): Promise<string> {
    return resumenPdf(base64Data);
  }
}
