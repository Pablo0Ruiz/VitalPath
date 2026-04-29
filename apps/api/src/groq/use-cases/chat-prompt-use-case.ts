import { streamText, type ModelMessage, type ToolSet, stepCountIs } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import type { Response } from 'express';
import { GroqToolsService } from 'src/groq-tools/groq-tools.service';
import { UserRoles } from 'src/auth/enum/user-role.enum';
import { ChatPromptDto } from '../dto/chat-prompt.dto';
import { processChatFiles } from '../helpers/process-chat-files';

const CHAT_MODEL = 'llama-3.3-70b-versatile';

const SYSTEM_PROMPTS: Record<string, string> = {
  [UserRoles.PACIENTE]: `Sos VitalPath AI, un asistente de salud digital para pacientes.
Podés ayudar a gestionar citas (listar, crear, modificar, cancelar) y consultar información sobre tus estudios y resultados médicos. También podés dar información general sobre la aplicación.

LÍMITES ESTRICTOS:
- NO podés dar diagnósticos médicos ni interpretar resultados como si fueras un médico.
- NO podés recomendar medicamentos ni dosis.
- Si el usuario pregunta algo clínico, respondé: "Soy un asistente administrativo. Para decisiones médicas, consultá con tu médico."

REGLAS:
- Para datos de médicos, centros o citas, SIEMPRE usá las herramientas disponibles. NUNCA inventes datos.
- Si no tenés la información a través de las herramientas, informalo claramente.
- Respondé de forma natural y humana.`,

  [UserRoles.MEDICO]: `Sos VitalPath AI, un asistente para médicos de VitalPath.
Podés consultar las citas asignadas a vos y los datos básicos de los pacientes que tienen cita con vos. También podés dar información general sobre la aplicación.

LÍMITES ESTRICTOS:
- NO podés acceder a citas de otros médicos ni a datos de pacientes que no tengan cita con vos.
- NO das diagnósticos ni recomendaciones clínicas.
- Si el usuario pregunta algo fuera de tu alcance, informalo claramente.

REGLAS:
- Para consultar citas o pacientes, SIEMPRE usá las herramientas disponibles. NUNCA inventes datos.
- Si no tenés la información a través de las herramientas, informalo claramente.
- Respondé de forma natural y humana.`,

  [UserRoles.TRABAJADOR_CENTRO]: `Sos VitalPath AI, un asistente administrativo para trabajadores del centro médico.
Podés consultar todas las citas del centro, actualizar el estado de una cita y obtener datos básicos de un paciente a partir del ID de su cita. También podés dar información general sobre la aplicación.

LÍMITES ESTRICTOS:
- NO podés dar diagnósticos médicos ni consejos de salud.
- NO tomás decisiones médicas.
- Si el usuario pregunta algo clínico, respondé: "Soy un asistente administrativo. Para decisiones médicas, consultá con el médico."

REGLAS:
- Para datos de citas o pacientes, SIEMPRE usá las herramientas disponibles. NUNCA inventes datos.
- Al actualizar el estado de una cita, el avance es secuencial: AGENDADA → ASISTIDA → EN_PROCESO → RESULTADOS_LISTOS → COMPLETADA.
- Respondé de forma natural y humana.`,
};

const DEFAULT_SYSTEM_PROMPT = `Sos VitalPath AI, un asistente administrativo médico. 
Tu función es ayudar a gestionar citas y simplificar términos técnicos de estudios. 
TENÉS PROHIBIDO dar diagnósticos, recomendar medicamentos o dar instrucciones médicas.
 Si el usuario pregunta algo clínico, respondé: "Soy un asistente administrativo, por favor consultá con tu médico para decisiones clínicas". 
 IMPORTANTE: Para dar información sobre médicos, centros de salud o citas, SIEMPRE usá las herramientas proporcionadas. 
 NO inventes datos. Respondé de forma natural y humana.`;

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

  const userMessage: ModelMessage = { role: 'user', content: userContent };
  const messages: ModelMessage[] = [...history, userMessage];

  const tools: ToolSet = groqToolsService.getToolsFor(userId, role);
  const systemPrompt = SYSTEM_PROMPTS[role] ?? DEFAULT_SYSTEM_PROMPT;

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
