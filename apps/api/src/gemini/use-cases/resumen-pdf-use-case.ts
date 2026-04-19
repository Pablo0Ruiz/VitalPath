import { GoogleGenAI } from '@google/genai';

export const resumenPdf = async (ai: GoogleGenAI, base64Data: string) => {
  const result = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      {
        role: 'user',
        parts: [
          {
            inlineData: {
              mimeType: 'application/pdf',
              data: base64Data,
            },
          },
          {
            text: 'Por favor, realizá un resumen claro y conciso de este documento PDF para que personas no técnicas entiendan los conceptos. Identificá los puntos más importantes, diagnósticos relevantes, medicaciones mencionadas y cualquier información médica clave que contenga.',
          },
        ],
      },
    ],
  });

  return result.text;
};
