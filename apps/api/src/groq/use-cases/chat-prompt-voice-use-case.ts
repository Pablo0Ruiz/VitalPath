import { generateText, stepCountIs, type ModelMessage, type ToolSet } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { GroqToolsService } from 'src/groq-tools/groq-tools.service';
import { UserRoles } from 'src/auth/enum/user-role.enum';
import { ChatPromptDto } from '../dto/chat-prompt.dto';
import { sanitizeMedicalText } from 'src/common/helpers/sanitize-text.helper';
import {
  CHAT_MODEL,
  DEFAULT_SYSTEM_PROMPT,
  SYSTEM_PROMPTS,
} from '../constants/system-prompts';

interface ChatParams {
  chatPromptDto: ChatPromptDto;
  groqToolsService: GroqToolsService;
  userId: string;
  role: UserRoles;
  history: ModelMessage[];
}

export const chatPromptUseCase = async ({
  chatPromptDto,
  groqToolsService,
  userId,
  role,
  history,
}: ChatParams): Promise<{
  transcript: string;
  replyText: string;
  messages: ModelMessage[];
}> => {
  const { prompt } = chatPromptDto;

  const sanitizedPrompt = sanitizeMedicalText(prompt);
  const userMessage: ModelMessage = { role: 'user', content: sanitizedPrompt };
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

  const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });

  const result = await generateText({
    model: groq(CHAT_MODEL),
    system: systemPrompt,
    messages,
    tools,
    stopWhen: stepCountIs(5),
  });

  return {
    transcript: prompt,
    replyText: result.text,
    messages: [userMessage, ...result.response.messages],
  };
};
