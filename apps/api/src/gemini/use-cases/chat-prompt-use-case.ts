import { Content, createPartFromUri, GoogleGenAI } from '@google/genai';
import { GeminiToolsService } from 'src/gemini-tools/gemini-tools.service';
import { appointmentTools, medicosTools } from 'src/gemini-tools/tools';
import { ChatPromptDto } from '../dto/chat-prompt.dto';
import { geminiUploadFiles } from '../helpers/gemini-upload-file';

const ALL_TOOLS = [...appointmentTools, ...medicosTools];
const model_AI = 'gemini-3-flash-preview';
interface Options {
  model?: string;
  systemInstruction?: string;
  history: Content[];
}

export const chatPromptStreamUseCase = async (
  ai: GoogleGenAI,
  chatPromptDto: ChatPromptDto,
  geminiToolsService: GeminiToolsService,
  userId: string,
  options?: Options,
) => {
  const { prompt, files = [] } = chatPromptDto;

  const images = await geminiUploadFiles(ai, files);

  const {
    model = model_AI,
    history = [],
    systemInstruction = `
      Eres VitalPath AI, un asistente administrativo médico. 
      Tu función es ayudar a gestionar citas y simplificar términos técnicos de estudios. 
      TIENES PROHIBIDO dar diagnósticos, recomendar medicamentos o dar instrucciones médicas. 
      Si el usuario pregunta algo clínico, responde: 'Soy un asistente administrativo, por favor consulte con su médico para decisiones clínicas
  `,
  } = options ?? {};

  const chat = ai.chats.create({
    model: model ?? model_AI,
    config: {
      systemInstruction,
      tools: [{ functionDeclarations: ALL_TOOLS }],
    },
    history,
  });

  const userParts = [
    prompt,
    ...images.map(image =>
      createPartFromUri(image.uri ?? '', image.mimeType ?? ''),
    ),
  ];

  const firstResponse = await chat.sendMessage({ message: userParts });

  const functionCall = firstResponse.functionCalls?.[0];

  if (functionCall?.name) {
    const toolResult = await geminiToolsService.executeTool(
      functionCall.name,
      (functionCall.args ?? {}) as Record<string, unknown>,
      userId,
    );

    return chat.sendMessageStream({
      message: [
        {
          functionResponse: {
            name: functionCall.name,
            response: { result: toolResult },
          },
        },
      ],
    });
  }

  return chat.sendMessageStream({ message: userParts });
};
