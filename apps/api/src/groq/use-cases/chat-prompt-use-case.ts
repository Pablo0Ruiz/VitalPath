import { streamText, type ModelMessage, type ToolSet, stepCountIs } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import type { Response } from 'express';
import { GroqToolsService } from 'src/groq-tools/groq-tools.service';
import { UserRoles } from 'src/auth/enum/user-role.enum';
import { ChatPromptDto } from '../dto/chat-prompt.dto';
import { processChatFiles } from '../helpers/process-chat-files';
import { sanitizeMedicalText } from 'src/common/helpers/sanitize-text.helper';
import {
  CHAT_MODEL,
  DEFAULT_SYSTEM_PROMPT,
  SYSTEM_PROMPTS,
} from '../constants/system-prompts';

interface ChatStreamParams {
  chatPromptDto: ChatPromptDto;
  groqToolsService: GroqToolsService;
  userId: string;
  role: UserRoles;
  history: ModelMessage[];
  res: Response;
}

export const chatPromptStreamUseCase = async ({
  chatPromptDto,
  groqToolsService,
  userId,
  role,
  history,
  res,
}: ChatStreamParams): Promise<ModelMessage[]> => {
  const { prompt, files = [] } = chatPromptDto;

  const pdfTexts = await processChatFiles(files);

  const userContent =
    pdfTexts.length > 0
      ? `${prompt}\n\n---\nContenido de documentos adjuntos:\n${pdfTexts.map((t, i) => `[Documento ${i + 1}]\n${t}`).join('\n\n')}`
      : prompt;

  const sanitizedUserContent = sanitizeMedicalText(userContent);
  const userMessage: ModelMessage = {
    role: 'user',
    content: sanitizedUserContent,
  };
  const messages: ModelMessage[] = [...history, userMessage];

  const now = new Date();
  const dateStr = now.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const tools: ToolSet = groqToolsService.getToolsFor(userId, role);
  const systemPrompt = `${SYSTEM_PROMPTS[role] ?? DEFAULT_SYSTEM_PROMPT}\n\nCONTEXTO TEMPORAL: Hoy es ${dateStr} y la hora actual es ${timeStr}.`;

  res.setHeader('Content-Type', 'text/plain');
  res.status(200);

  const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });

  let persistedMessages: ModelMessage[] = [];

  const result = streamText({
    model: groq(CHAT_MODEL),
    system: systemPrompt,
    messages,
    tools,
    stopWhen: stepCountIs(5),
    onFinish: ({ response }) => {
      persistedMessages = [userMessage, ...response.messages];
    },
  });

  for await (const chunk of result.textStream) {
    res.write(chunk);
  }
  res.end();

  await result.finishReason;

  return persistedMessages;
};
