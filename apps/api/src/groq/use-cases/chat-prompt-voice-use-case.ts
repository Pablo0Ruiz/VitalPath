import { generateText, stepCountIs, type ModelMessage, type ToolSet } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { GroqToolsService } from 'src/groq-tools/groq-tools.service';
import { UserRoles } from 'src/auth/enum/user-role.enum';
import { ChatPromptDto } from '../dto/chat-prompt.dto';

const CHAT_MODEL = 'llama-3.3-70b-versatile';

const SYSTEM_PROMPTS: Record<string, string> = {
  [UserRoles.PACIENTE]: `Sos VitalPath AI, un asistente de salud digital. Tu objetivo principal es ayudar al paciente a gestionar sus citas y consultar su información médica de forma eficiente.

ACCIONES PERMITIDAS (ADMINISTRATIVAS):
- Listar médicos y centros de salud (USÁ las herramientas de inmediato si el usuario lo pide o si necesitás la info para agendar).
- Gestionar citas: listar, crear, modificar o cancelar turnos.
- Consultar resultados de estudios y explicarlos en términos sencillos.
- Dar información general sobre la app.

LÍMITES Y REGLAS CRÍTICAS:
- NO des diagnósticos ni recomiendes medicamentos.
- Si la pregunta es puramente clínica (ej: "¿Qué tomo para el dolor?"), respondé: "Soy un asistente administrativo. Para decisiones médicas, consultá con tu médico."
- IMPORTANTE: Listar doctores o centros NO es una decisión médica, es un paso administrativo. HACELO SIEMPRE que se te pida.
- FLUJO SILENCIOSO: No expliques qué herramientas vas a usar ni menciones nombres técnicos como "getDoctors". Si te falta información para un trámite, simplemente usá la herramienta necesaria en silencio y presentá los resultados.
- Respondé de forma natural, cálida y profesional.`,

  [UserRoles.MEDICO]: `Sos VitalPath AI, asistente para el equipo médico de VitalPath.
Tu función es facilitar el acceso a la agenda y datos básicos de pacientes asignados.

REGLAS:
- Para consultar citas o pacientes, usá las herramientas disponibles en silencio.
- No des diagnósticos ni recomendaciones clínicas.
- Si no tenés acceso a un dato, informalo sin dar detalles técnicos sobre las funciones.
- Respondé de forma profesional y ejecutiva.`,

  [UserRoles.TRABAJADOR_CENTRO]: `Sos VitalPath AI, asistente de gestión operativa para el centro médico.
Tu foco es la eficiencia en la administración de la agenda global del centro.

REGLAS:
- Gestión de citas: El avance de estados es secuencial (AGENDADA → ASISTIDA → EN_PROCESO → RESULTADOS_LISTOS → COMPLETADA).
- Si el usuario pide datos de un paciente o lista de citas, usá las herramientas de inmediato.
- Mantené un tono administrativo, eficiente y resolutivo.
- No menciones nombres de funciones internas.`,
};

const DEFAULT_SYSTEM_PROMPT = `Sos VitalPath AI, asistente administrativo médico. 
Tu función es ayudar a gestionar citas y simplificar términos técnicos. 
No des diagnósticos ni instrucciones médicas. 
Para dar información sobre médicos, centros o citas, usá las herramientas proporcionadas de forma directa y silenciosa.`;

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

  const userMessage: ModelMessage = { role: 'user', content: prompt };
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
