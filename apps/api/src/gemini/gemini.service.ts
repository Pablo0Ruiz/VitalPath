import { Injectable } from '@nestjs/common';
import { Content, GoogleGenAI } from '@google/genai';
import { ChatPromptDto } from './dto/chat-prompt.dto';
import { chatPromptStreamUseCase } from './use-cases/chat-prompt-use-case';

@Injectable()
export class GeminiService {
  private ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  private chatHistory = new Map<string, Content[]>();

  async chatStream(chatPromptDto: ChatPromptDto) {
    const chatHistory = this.getChatHistory(chatPromptDto.chatId);
    return await chatPromptStreamUseCase(this.ai, chatPromptDto, {
      history: chatHistory,
    });
  }
  saveMesssage(chatId: string, message: Content) {
    const messages = this.getChatHistory(chatId);
    messages.push(message);
    this.chatHistory.set(chatId, messages);
  }

  getChatHistory(chatId: string) {
    return structuredClone(this.chatHistory.get(chatId) ?? []);
  }
}
