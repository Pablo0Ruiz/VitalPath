import { BadRequestException } from '@nestjs/common';
import pdf from 'pdf-parse';

const isPdf = (file: Express.Multer.File): boolean => {
  if (file.mimetype === 'application/pdf') return true;
  if (file.mimetype.includes('application/octet-stream')) {
    const ext = file.originalname.split('.').pop()?.toLowerCase();
    return ext === 'pdf';
  }
  return false;
};

export const processChatFiles = async (
  files: Express.Multer.File[],
): Promise<string[]> => {
  if (!files || files.length === 0) return [];

  for (const file of files) {
    if (!isPdf(file)) {
      throw new BadRequestException('Solo se aceptan archivos PDF');
    }
  }

  const extracted = await Promise.all(
    files.map(async file => {
      const parsed = await pdf(file.buffer);
      return (parsed.text ?? '').trim();
    }),
  );

  return extracted.filter(t => t.length > 0);
};
