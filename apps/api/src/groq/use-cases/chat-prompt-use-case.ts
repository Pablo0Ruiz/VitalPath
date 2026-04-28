import { streamText, type ModelMessage, type ToolSet, stepCountIs } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import type { Response } from 'express';
import { GroqToolsService } from 'src/groq-tools/groq-tools.service';
import { ChatPromptDto } from '../dto/chat-prompt.dto';
import { processChatFiles } from '../helpers/process-chat-files';

const CHAT_MODEL = 'llama-3.3-70b-versatile';
const SYSTEM_PROMPT = `Eres VitalPath AI, un asistente administrativo médico. Tu función es ayudar a gestionar citas y simplificar términos técnicos de estudios. TIENES PROHIBIDO dar diagnósticos, recomendar medicamentos o dar instrucciones médicas. Si el usuario pregunta algo clínico, responde: 'Soy un asistente administrativo, por favor consulte con su médico para decisiones clínicas'. IMPORTANTE: Para dar información sobre médicos, centros de salud o citas, DEBES usar siempre las herramientas proporcionadas. NO inventes nombres de médicos, centros o datos de contacto. Si no tienes la información vía herramientas, indícalo claramente.Tu respuesta debe ser lo mas natural o humanamente posible.`;

interface ChatStreamParams {
  chatPromptDto: ChatPromptDto;
  groqToolsService: GroqToolsService;
  userId: string;
  history: ModelMessage[];
  res: Response;
}

export const chatPromptStreamUseCase = async ({
  chatPromptDto,
  groqToolsService,
  userId,
  history,
  res,
}: ChatStreamParams): Promise<ModelMessage[]> => {
  const { prompt, files = [] } = chatPromptDto;

  const pdfTexts = await processChatFiles(files);

  const userContent =
    pdfTexts.length > 0
      ? `${prompt}\n\n---\nContenido de documentos adjuntos:\n${pdfTexts.map((t, i) => `[Documento ${i + 1}]\n${t}`).join('\n\n')}`
      : prompt;

  const userMessage: ModelMessage = { role: 'user', content: userContent };
  const messages: ModelMessage[] = [...history, userMessage];

  const tools: ToolSet = groqToolsService.getToolsFor(userId);

  res.setHeader('Content-Type', 'text/plain');
  res.status(200);

  const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });

  let persistedMessages: ModelMessage[] = [];

  const result = streamText({
    model: groq(CHAT_MODEL),
    system: SYSTEM_PROMPT,
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
