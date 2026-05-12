import { ModelMessage, streamText } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { Response } from 'express';
import { chatPromptStreamUseCase } from './chat-prompt-use-case';
import { UserRoles } from 'src/auth/enum/user-role.enum';
import { processChatFiles } from '../helpers/process-chat-files';
import { GroqToolsService } from 'src/groq-tools/groq-tools.service';
import { ChatPromptDto } from '../dto/chat-prompt.dto';
import { sanitizeMedicalText } from 'src/common/helpers/sanitize-text.helper';

jest.mock('ai');
jest.mock('@ai-sdk/groq');
jest.mock('../helpers/process-chat-files');
jest.mock('src/common/helpers/sanitize-text.helper', () => ({
  sanitizeMedicalText: jest.fn((text: string) => text),
}));

describe('chatPromptStreamUseCase', () => {
  let res: Partial<Response>;
  const chatPromptDto: ChatPromptDto = {
    chatId: '499e909a-4c2f-488b-877f-1d686f06535c',
    prompt: 'hello',
    files: [],
  };
  const groqToolsService = {
    getToolsFor: jest.fn(),
  } as unknown as GroqToolsService;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.GROQ_API_KEY = 'test-key';
    res = {
      setHeader: jest.fn(),
      status: jest.fn(),
      write: jest.fn(),
      end: jest.fn(),
    };
  });

  it('should stream text and return persisted messages', async () => {
    const userId = 'user1';
    const role = UserRoles.PACIENTE;
    const history = [];

    (processChatFiles as jest.Mock).mockResolvedValue([]);

    let onFinishCallback: (event: {
      response: { messages: ModelMessage[] };
    }) => void;
    const mockStream = {
      textStream: (async function* () {
        yield 'Hello';
        yield ' world';
        if (onFinishCallback) {
          onFinishCallback({
            response: {
              messages: [{ role: 'assistant', content: 'Hello world' }],
            },
          });
        }
      })(),
      finishReason: Promise.resolve('stop'),
    };
    (streamText as jest.Mock).mockImplementation(options => {
      onFinishCallback = options.onFinish;
      return mockStream;
    });

    const mockGroq = jest.fn();
    (createGroq as jest.Mock).mockReturnValue(mockGroq);

    const result = await chatPromptStreamUseCase({
      chatPromptDto,
      groqToolsService,
      userId,
      role,
      history,
      res: res as Response,
    });

    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/plain');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.write).toHaveBeenCalledWith('Hello');
    expect(res.write).toHaveBeenCalledWith(' world');
    expect(res.end).toHaveBeenCalled();
    expect(result).toEqual([
      { role: 'user', content: 'hello' },
      { role: 'assistant', content: 'Hello world' },
    ]);
  });

  it('should include PDF text in user message when files are provided', async () => {
    (processChatFiles as jest.Mock).mockResolvedValue([
      'Extracted PDF content',
    ]);
    const mockStream = {
      textStream: (async function* () {
        yield 'Response';
      })(),
      finishReason: Promise.resolve('stop'),
    };
    (streamText as jest.Mock).mockReturnValue(mockStream);

    await chatPromptStreamUseCase({
      chatPromptDto: {
        ...chatPromptDto,
        files: [{} as Express.Multer.File],
      },
      groqToolsService,
      userId: 'u',
      role: UserRoles.PACIENTE,
      history: [],
      res: res as Response,
    });

    const streamOptions = (streamText as jest.Mock).mock.calls[0][0];
    expect(streamOptions.messages[0].content).toContain(
      'Extracted PDF content',
    );
  });

  it('should pass prompt through sanitizeMedicalText before building userMessage (REQ-PII-03)', async () => {
    const piiPrompt = 'Mi DNI es 12345678 y mi RUC es 10345678901';
    const sanitizedOutput = 'Mi DNI es [DNI] y mi RUC es [RUC]';

    (processChatFiles as jest.Mock).mockResolvedValue([]);
    (sanitizeMedicalText as jest.Mock).mockReturnValueOnce(sanitizedOutput);

    const mockStream = {
      textStream: (async function* () {
        yield 'ok';
      })(),
      finishReason: Promise.resolve('stop'),
    };
    (streamText as jest.Mock).mockImplementation(options => {
      options.onFinish?.({ response: { messages: [] } });
      return mockStream;
    });

    await chatPromptStreamUseCase({
      chatPromptDto: { ...chatPromptDto, prompt: piiPrompt },
      groqToolsService,
      userId: 'u',
      role: UserRoles.PACIENTE,
      history: [],
      res: res as Response,
    });

    expect(sanitizeMedicalText).toHaveBeenCalledWith(piiPrompt);

    const streamOptions = (streamText as jest.Mock).mock.calls[0][0];
    expect(streamOptions.messages[0].content).toBe(sanitizedOutput);
    expect(streamOptions.messages[0].content).not.toContain('12345678');
  });

  it('should forward clean prompt unchanged (REQ-PII-03 — no PII)', async () => {
    const cleanPrompt = '¿Cuáles son mis próximas citas?';
    (processChatFiles as jest.Mock).mockResolvedValue([]);
    (sanitizeMedicalText as jest.Mock).mockReturnValueOnce(cleanPrompt);

    const mockStream = {
      textStream: (async function* () {
        yield 'ok';
      })(),
      finishReason: Promise.resolve('stop'),
    };
    (streamText as jest.Mock).mockReturnValue(mockStream);

    await chatPromptStreamUseCase({
      chatPromptDto: { ...chatPromptDto, prompt: cleanPrompt },
      groqToolsService,
      userId: 'u',
      role: UserRoles.PACIENTE,
      history: [],
      res: res as Response,
    });

    const streamOptions = (streamText as jest.Mock).mock.calls[0][0];
    expect(streamOptions.messages[0].content).toBe(cleanPrompt);
  });
});
