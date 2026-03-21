import { fetch } from 'expo/fetch';
import { FileType, promptWithFiles } from './helpers/prompt-with-images';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const getChatStream = async (
  prompt: string,
  files: FileType[],
  chatId: string,
  onChunk: (text: string) => void,
) => {
  if (files.length > 0) {
    const response = await promptWithFiles(
      '/api/gemini/chat-stream',
      { prompt, chatId },
      files,
    );
    onChunk(response);
    return;
  }
  const formData = new FormData();
  formData.append('prompt', prompt);
  formData.append('chatId', chatId);

  try {
    const response = await fetch(`${API_URL}/api/gemini/chat-stream`, {
      method: 'POST',
      headers: {
        Accept: 'text/plain',
      },
      body: formData,
    });

    if (!response.body) {
      console.error('El body de la respuesta es nulo');
      throw new Error('El body de la respuesta es nulo');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');

    let result = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      result += chunk;
      onChunk(result);
    }
  } catch (error) {
    console.error('Error al obtener la respuesta del modelo:', error);
    throw new Error('Error al obtener la respuesta del modelo');
  }
};
