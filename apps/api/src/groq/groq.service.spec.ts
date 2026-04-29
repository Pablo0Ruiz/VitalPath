import { Test, TestingModule } from '@nestjs/testing';
import { GroqService } from './groq.service';
import { GroqToolsService } from 'src/groq-tools/groq-tools.service';
import { chatPromptStreamUseCase } from './use-cases/chat-prompt-use-case';
import { resumenPdf } from './use-cases/resumen-pdf-use-case';
import { UserRoles } from 'src/auth/enum/user-role.enum';
import { Response } from 'express';
import { ChatPromptDto } from './dto/chat-prompt.dto';
import { ModelMessage } from 'ai';

jest.mock('./use-cases/chat-prompt-use-case');
jest.mock('./use-cases/resumen-pdf-use-case');

describe('GroqService', () => {
  let service: GroqService;
  let groqToolsService: GroqToolsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroqService,
        {
          provide: GroqToolsService,
          useValue: {
            getToolsFor: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GroqService>(GroqService);
    groqToolsService = module.get<GroqToolsService>(GroqToolsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('chatStream', () => {
    it('should call chatPromptStreamUseCase and update history', async () => {
      const chatPromptDto: ChatPromptDto = {
        chatId: '499e909a-4c2f-488b-877f-1d686f06535c',
        prompt: 'hello',
        files: [],
      };
      const userId = 'user-123';
      const role = UserRoles.PACIENTE;
      const res = {} as Response;
      const newMessages = [
        { role: 'user', content: 'hello' },
        { role: 'assistant', content: 'hi' },
      ];

      (chatPromptStreamUseCase as jest.Mock).mockResolvedValue(newMessages);

      await service.chatStream(chatPromptDto, userId, role, res);

      expect(chatPromptStreamUseCase).toHaveBeenCalledWith({
        chatPromptDto,
        groqToolsService,
        userId,
        role,
        history: [],
        res,
      });

      const history = service.getChatHistory(
        '499e909a-4c2f-488b-877f-1d686f06535c',
      );
      expect(history).toEqual(newMessages);
    });

    it('should maintain separate history per chatId', async () => {
      const chat1Dto: ChatPromptDto = {
        chatId: '499e909a-4c2f-488b-877f-1d686f065351',
        prompt: 'p1',
        files: [],
      };
      const chat2Dto: ChatPromptDto = {
        chatId: '499e909a-4c2f-488b-877f-1d686f065352',
        prompt: 'p2',
        files: [],
      };
      const res = {} as Response;

      (chatPromptStreamUseCase as jest.Mock).mockResolvedValueOnce([
        { role: 'user', content: 'm1' },
      ]);
      await service.chatStream(chat1Dto, 'u', UserRoles.PACIENTE, res);

      (chatPromptStreamUseCase as jest.Mock).mockResolvedValueOnce([
        { role: 'user', content: 'm2' },
      ]);
      await service.chatStream(chat2Dto, 'u', UserRoles.PACIENTE, res);

      expect(
        service.getChatHistory('499e909a-4c2f-488b-877f-1d686f065351'),
      ).toHaveLength(1);
      expect(
        service.getChatHistory('499e909a-4c2f-488b-877f-1d686f065352'),
      ).toHaveLength(1);
      expect(
        service.getChatHistory('499e909a-4c2f-488b-877f-1d686f065351')[0]
          .content,
      ).toBe('m1');
      expect(
        service.getChatHistory('499e909a-4c2f-488b-877f-1d686f065352')[0]
          .content,
      ).toBe('m2');
    });
  });

  describe('getChatHistory', () => {
    it('should return an empty array if chatId not found', () => {
      const history = service.getChatHistory('non-existent');
      expect(history).toEqual([]);
    });

    it('should return a clone of the history', () => {
      const chatId = '499e909a-4c2f-488b-877f-1d686f06535c';
      const msg: ModelMessage = { role: 'user', content: 'hi' };
      (
        service as unknown as { chatHistory: Map<string, ModelMessage[]> }
      ).chatHistory.set(chatId, [msg]);

      const history = service.getChatHistory(chatId);
      expect(history).toEqual([msg]);
      expect(history[0]).not.toBe(msg);
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
