import { GoogleGenAI } from '@google/genai';

const fileMimeTypesByExtension: Record<string, string> = {
  jpg: 'image/jpg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
};

export const geminiUploadFiles = async (
  ai: GoogleGenAI,
  files: Express.Multer.File[],
) => {
  const uploadedFiles = await Promise.all(
    files.map(file => {
      const fileExtension = file.originalname.split('.').pop() ?? '';
      const fileMimeType: string =
        fileMimeTypesByExtension[fileExtension] ?? '';

      const type = file.mimetype.includes('application/octet-stream')
        ? fileMimeType
        : file.mimetype;

      const buffer = Uint8Array.from(file.buffer as unknown as Buffer);
      return ai.files.upload({
        file: new Blob([buffer], {
          type,
        }),
      });
    }),
  );

  return uploadedFiles;
};
