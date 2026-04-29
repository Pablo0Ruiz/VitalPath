import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
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
    @GetUser('_id') userId: string,
    @GetUser('role') role: UserRoles,
  ): Promise<void> {
    chatPromptDto.files = files;
    await this.groqService.chatStream(chatPromptDto, userId, role, res);
  }

  @Auth()
  @Get('chat-history/:chatId')
  getChatHistory(@Param('chatId') chatId: string) {
    const history = this.groqService.getChatHistory(chatId);

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
