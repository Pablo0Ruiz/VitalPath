import { fetch } from 'expo/fetch';
import * as SecureStore from 'expo-secure-store';
import {
  ACCESS_TOKEN_KEY,
  refreshTokens,
  SessionExpiredError,
} from '@repo/api-client';
import { type FileType, promptWithFiles } from '@/src/utils/prompt-with-images';

const API_URL = process.env.EXPO_PUBLIC_AI_API_URL;

async function doStreamRequest(
  url: string,
  formData: FormData,
  token: string | null,
) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
      Accept: 'plain/text',
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
}

export const getChatStream = async (
  prompt: string,
  files: FileType[],
  chatId: string,
  onChunk: (text: string) => void,
) => {
  const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);

  if (files.length > 0) {
    const response = await promptWithFiles(
      '/chat-stream',
      { prompt, chatId },
      files,
    );
    onChunk(response);
    return;
  }

  const formData = new FormData();
  formData.append('prompt', prompt);
  formData.append('chatId', chatId);

  const streamUrl = `${API_URL}/chat-stream`;

  try {
    let response = await doStreamRequest(streamUrl, formData, token);

    if (response.status === 401) {
      const newToken = await refreshTokens();
      response = await doStreamRequest(streamUrl, formData, newToken);

      if (response.status === 401) {
        throw new SessionExpiredError('Session expired');
      }
    }

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
    if (error instanceof SessionExpiredError) {
      throw error;
    }
    console.error('Error al obtener la respuesta del modelo:', error);
    throw new Error('Error al obtener la respuesta del modelo');
  }
};
