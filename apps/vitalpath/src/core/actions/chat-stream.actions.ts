import { fetch } from 'expo/fetch';
import * as SecureStore from 'expo-secure-store';
import { FileType } from './helpers/prompt-with-images';
import { ACCESS_TOKEN_KEY } from '@/src/context/AuthContext';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const getChatStream = async (
  prompt: string,
  files: FileType[],
  chatId: string,
  onChunk: (text: string) => void,
) => {
  const formData = new FormData();
  formData.append('prompt', prompt);
  formData.append('chatId', chatId);

  files.forEach((file, index) => {
    const fileData = {
      uri: file.uri,
      name: file.fileName || `file_${index}`,
      type: file.type || 'image/jpeg',
    };
    formData.append('files', fileData as any);
  });

  try {
    const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);

    const response = await fetch(`${API_URL}/api/gemini/chat-stream`, {
      method: 'POST',
      headers: {
        Accept: 'text/plain',
        Authorization: `Bearer ${token}`,
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
