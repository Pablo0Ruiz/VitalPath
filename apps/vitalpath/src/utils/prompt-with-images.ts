import { aiApi } from '@repo/api-client';

export interface FileType {
  uri: string;
  fileName?: string;
  type?: string;
  size?: number;
}

interface JsonBody {
  [key: string]: string | number | boolean | null | undefined;
}

export const promptWithFiles = async (
  endpoint: string,
  body: JsonBody,
  files: FileType[],
): Promise<string> => {
  try {
    const formData = new FormData();
    Object.entries(body).forEach(([key, value]) => {
      formData.append(key, String(value ?? ''));
    });

    files.forEach((file, index) => {
      const fileData = {
        uri: file.uri,
        name: file.fileName || `file_${index}`,
        type: file.type || 'image/jpeg',
      };
      formData.append('files', fileData as unknown as Blob);
    });

    const response = await aiApi.post(endpoint, formData);
    return response.data;
  } catch (error) {
    console.error('Error al obtener la respuesta del modelo:', error);
    throw new Error('Error al obtener la respuesta del modelo');
  }
};
