import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { type Response } from 'express';
import { GroqService } from './groq.service';
import { ChatPromptDto } from './dto/chat-prompt.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { UserRoles } from 'src/auth/enum/user-role.enum';
import type { ModelMessage } from 'ai';

@Controller('gemini')
export class GroqController {
  constructor(private readonly groqService: GroqService) {}

  @Auth()
  @Post('chat-stream')
  @UseInterceptors(FilesInterceptor('files'))
  async chatStream(
    @Body() chatPromptDto: ChatPromptDto,
    @Res() res: Response,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @GetUser('id') userId: string,
    @GetUser('role') role: UserRoles,
  ): Promise<void> {
    chatPromptDto.files = files;
    await this.groqService.chatStream(chatPromptDto, userId, role, res);
  }

  @Auth()
  @Post('voice-chat')
  @UseInterceptors(FileInterceptor('file'))
  async voiceChat(
    @UploadedFile() file: Express.Multer.File,
    @Body('chatId') chatId: string,
    @GetUser('id') userId: string,
    @GetUser('role') role: UserRoles,
  ) {
    if (!file) {
      throw new Error('No se recibió ningún archivo de audio');
    }

    const transcript = await this.groqService.transcribe(file);
    return this.groqService.voiceChat(
      { prompt: transcript, chatId, files: [] },
      userId,
      role,
    );
  }

  @Auth()
  @Get('conversations')
  async getConversations(@GetUser('id') userId: string) {
    return this.groqService.getUserConversations(userId);
  }

  @Auth()
  @Get('chat-history/:chatId')
  async getChatHistory(@Param('chatId') chatId: string) {
    const history = await this.groqService.getChatHistory(chatId);

    return history
      .filter(
        (m): m is ModelMessage & { role: 'user' | 'assistant' } =>
          m.role === 'user' || m.role === 'assistant',
      )
      .map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts:
          typeof m.content === 'string'
            ? m.content
            : (m.content as Array<{ type: string; text?: string }>)
                .filter(p => p.type === 'text')
                .map(p => p.text ?? '')
                .join(''),
      }));
  }
}
