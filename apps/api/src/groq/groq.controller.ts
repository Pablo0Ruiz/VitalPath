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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { type Response } from 'express';
import { GroqService } from './groq.service';
import { ChatPromptDto } from './dto/chat-prompt.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { UserRoles } from 'src/auth/enum/user-role.enum';
import type { ModelMessage } from 'ai';

@ApiTags('ai')
@ApiBearerAuth('access-token')
@Controller('ai')
export class GroqController {
  constructor(private readonly groqService: GroqService) {}

  @Auth()
  @Post('chat-stream')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiOperation({
    summary: 'Stream an AI chat response (text + optional file context)',
  })
  @ApiResponse({ status: 200, description: 'SSE stream of AI response chunks' })
  @ApiResponse({ status: 401, description: 'Missing or invalid token' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['prompt', 'chatId'],
      properties: {
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description: 'Optional context files',
        },
        prompt: { type: 'string', description: 'User message' },
        chatId: {
          type: 'string',
          format: 'uuid',
          description: 'Conversation UUID',
        },
      },
    },
  })
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
  @ApiOperation({ summary: 'Transcribe audio and send as AI chat message' })
  @ApiResponse({
    status: 201,
    description: 'AI response to transcribed voice message',
  })
  @ApiResponse({ status: 401, description: 'Missing or invalid token' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file', 'chatId'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Audio file to transcribe',
        },
        chatId: {
          type: 'string',
          description: 'Conversation ID (plain string)',
        },
      },
    },
  })
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
  @ApiOperation({ summary: 'Get all conversations for the authenticated user' })
  @ApiResponse({ status: 200, description: 'List of conversations' })
  @ApiResponse({ status: 401, description: 'Missing or invalid token' })
  async getConversations(@GetUser('id') userId: string) {
    return this.groqService.getUserConversations(userId);
  }

  @Auth()
  @Get('chat-history/:chatId')
  @ApiOperation({ summary: 'Get chat history for a conversation' })
  @ApiResponse({
    status: 200,
    description: 'Ordered list of user and assistant messages',
  })
  @ApiResponse({ status: 401, description: 'Missing or invalid token' })
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
