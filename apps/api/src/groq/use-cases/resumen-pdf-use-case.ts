import { generateText } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import pdf from 'pdf-parse';
import { sanitizeMedicalText } from '../../common/helpers/sanitize-text.helper';

const SUMMARY_MODEL = 'llama-3.1-8b-instant';
const FALLBACK =
  'No se pudo extraer texto del PDF (puede tratarse de un documento escaneado o protegido).';

export const resumenPdf = async (base64Data: string): Promise<string> => {
  const buffer = Buffer.from(base64Data, 'base64');
  const parsed = await pdf(buffer);
  const extracted = (parsed.text ?? '').trim();

  if (extracted.length === 0) return FALLBACK;

  const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });
  const sanitizedText = sanitizeMedicalText(extracted);

  const { text } = await generateText({
    model: groq(SUMMARY_MODEL),
    prompt: `Por favor, realizá un resumen claro y conciso del siguiente documento PDF para que personas no técnicas entiendan los conceptos. Identificá los puntos más importantes, diagnósticos relevantes, medicaciones mencionadas y cualquier información médica clave que contenga.\n\n---\n${sanitizedText}`,
  });

  return text;
};
