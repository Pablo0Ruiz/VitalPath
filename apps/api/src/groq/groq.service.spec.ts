import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { GroqService } from './groq.service';
import { GroqToolsService } from 'src/groq-tools/groq-tools.service';
import { chatPromptStreamUseCase } from './use-cases/chat-prompt-use-case';
import { resumenPdf } from './use-cases/resumen-pdf-use-case';
import { UserRoles } from 'src/auth/enum/user-role.enum';
import { Response } from 'express';
import { ChatPromptDto } from './dto/chat-prompt.dto';
import { Conversation } from './entities/conversation.entity';

jest.mock('./use-cases/chat-prompt-use-case');
jest.mock('./use-cases/resumen-pdf-use-case');

describe('GroqService', () => {
  let service: GroqService;
  let conversationModel: {
    findOne: jest.Mock;
    findOneAndUpdate: jest.Mock;
    find: jest.Mock;
  };

  beforeEach(async () => {
    conversationModel = {
      findOne: jest.fn().mockResolvedValue(null),
      findOneAndUpdate: jest.fn().mockResolvedValue({ messages: [] }),
      find: jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([]),
        }),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroqService,
        {
          provide: GroqToolsService,
          useValue: {
            getToolsFor: jest.fn(),
          },
        },
        {
          provide: getModelToken(Conversation.name),
          useValue: conversationModel,
        },
      ],
    }).compile();

    service = module.get<GroqService>(GroqService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('chatStream', () => {
    it('should call chatPromptStreamUseCase and update history in DB', async () => {
      const chatPromptDto: ChatPromptDto = {
        chatId: 'chat-123',
        prompt: 'hello',
        files: [],
      };
      const userId = '64b5fde500d5f66cdc49415a';
      const role = UserRoles.PACIENTE;
      const res = {} as Response;
      const newMessages = [
        { role: 'user', content: 'hello' },
        { role: 'assistant', content: 'hi' },
      ];

      (chatPromptStreamUseCase as jest.Mock).mockResolvedValue(newMessages);
      conversationModel.findOne.mockResolvedValue(null);

      await service.chatStream(chatPromptDto, userId, role, res);

      expect(chatPromptStreamUseCase).toHaveBeenCalled();
      expect(conversationModel.findOneAndUpdate).toHaveBeenCalledWith(
        { chatId: 'chat-123' },
        expect.any(Object),
        expect.any(Object),
      );
    });
  });

  describe('getChatHistory', () => {
    it('should return an empty array if conversation not found', async () => {
      conversationModel.findOne.mockResolvedValue(null);
      const history = await service.getChatHistory('non-existent');
      expect(history).toEqual([]);
    });

    it('should return sanitized messages if conversation exists', async () => {
      const mockConversation = {
        chatId: 'chat-123',
        messages: [
          { role: 'user', content: 'hi' },
          { role: 'assistant', content: [{ type: 'text', text: 'hello' }] },
        ],
      };
      conversationModel.findOne.mockResolvedValue(mockConversation);

      const history = await service.getChatHistory('chat-123');
      expect(history).toHaveLength(2);
      expect(history[0].role).toBe('user');
    });
  });

  describe('resumenResultadoEstudio', () => {
    it('should call resumenPdf', async () => {
      const base64 = 'base64data';
      (resumenPdf as jest.Mock).mockResolvedValue('Resumen');

      const result = await service.resumenResultadoEstudio(base64);

      expect(resumenPdf).toHaveBeenCalledWith(base64);
      expect(result).toBe('Resumen');
    });
  });
});
