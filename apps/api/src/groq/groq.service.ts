import { Injectable } from '@nestjs/common';
import type { ModelMessage } from 'ai';
import type { Response } from 'express';
import { GroqToolsService } from 'src/groq-tools/groq-tools.service';
import { UserRoles } from 'src/auth/enum/user-role.enum';
import { ChatPromptDto } from './dto/chat-prompt.dto';
import { chatPromptStreamUseCase } from './use-cases/chat-prompt-use-case';
import { resumenPdf } from './use-cases/resumen-pdf-use-case';

@Injectable()
export class GroqService {
  private chatHistory = new Map<string, ModelMessage[]>();

  constructor(private readonly groqToolsService: GroqToolsService) {}

  async chatStream(
    chatPromptDto: ChatPromptDto,
    userId: string,
    role: UserRoles,
    res: Response,
  ): Promise<void> {
    const history = this.getChatHistory(chatPromptDto.chatId);

    const newMessages = await chatPromptStreamUseCase({
      chatPromptDto,
      groqToolsService: this.groqToolsService,
      userId,
      role,
      history,
      res,
    });

    this.chatHistory.set(chatPromptDto.chatId, [...history, ...newMessages]);
  }

  getChatHistory(chatId: string): ModelMessage[] {
    return structuredClone(this.chatHistory.get(chatId) ?? []);
  }

  async resumenResultadoEstudio(base64Data: string): Promise<string> {
    return resumenPdf(base64Data);
  }
}
