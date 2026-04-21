import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { GenerateContentResponse } from '@google/genai';
import { type Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ChatPromptDto } from './dto/chat-prompt.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  async outputStream(
    res: Response,
    stream: AsyncGenerator<GenerateContentResponse, unknown, unknown>,
  ) {
    res.setHeader('Content-Type', 'text/plain');
    res.status(HttpStatus.OK);

    let resultText = '';
    for await (const chunk of stream) {
      const piece = chunk.text;
      resultText += piece;
      res.write(piece);
    }
    res.end();
    return resultText;
  }

  @Auth()
  @Post('chat-stream')
  @UseInterceptors(FilesInterceptor('files'))
  async chatStream(
    @Body() chatPromptDto: ChatPromptDto,
    @Res() res: Response,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @GetUser('_id') userId: string,
  ) {
    chatPromptDto.files = files;
    const stream = await this.geminiService.chatStream(chatPromptDto, userId);
    const data = await this.outputStream(res, stream);

    const geminiMessage = {
      role: 'model',
      parts: [{ text: data }],
    };

    const userMessage = {
      role: 'user',
      parts: [{ text: chatPromptDto.prompt }],
    };
    this.geminiService.saveMesssage(chatPromptDto.chatId, userMessage);
    this.geminiService.saveMesssage(chatPromptDto.chatId, geminiMessage);
  }

  @Auth()
  @Get('chat-history/:chatId')
  getChatHistory(@Param('chatId') chatId: string) {
    return this.geminiService.getChatHistory(chatId).map(message => ({
      role: message.role,
      parts: message.parts?.map(part => part.text).join(''),
    }));
  }
}
