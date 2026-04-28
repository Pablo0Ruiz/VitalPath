import type { IMedicalResults } from '@repo/types';
import { apiClient } from '../client';

export const getMedicalResults = async (): Promise<IMedicalResults[]> => {
  const { data } = await apiClient.get<IMedicalResults[]>(
    `/api/storage/resultado/pacientes`,
  );
  return data;
};

export const getPdfAndSummary = async (
  path: string,
): Promise<{ publicUrl: string; resumen: string }> => {
  const { data } = await apiClient.get<{ publicUrl: string; resumen: string }>(
    `/api/storage/get-pdf?path=${path}`,
  );
  return data;
};

export const getMedicalResultsPaciente = async (): Promise<
  IMedicalResults[]
> => {
  const { data } = await apiClient.get<IMedicalResults[]>(
    `/api/storage/resultado/mis-resultados`,
  );
  return data;
};

export const uploadStudy = async (
  file: File,
  ctx: { paciente_ID: string; cita_ID?: string },
): Promise<void> => {
  const form = new FormData();
  form.append('files', file);
  form.append('paciente_ID', ctx.paciente_ID);
  if (ctx.cita_ID) form.append('cita_ID', ctx.cita_ID);
  await apiClient.post('/api/storage/upload-file', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
