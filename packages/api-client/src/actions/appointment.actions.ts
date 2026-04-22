import { apiClient } from '../client';
import type {
  Cita,
  CitaPopulated,
  CreateCitaPayload,
  UpdateCitaPayload,
} from '@repo/types';

export const getCitas = async (): Promise<CitaPopulated[]> => {
  const { data } = await apiClient.get<CitaPopulated[]>('/api/appointment');
  return data.map(cita => ({ ...cita, fecha: cita.fecha.split('T')[0] }));
};

export const postCita = async (payload: CreateCitaPayload): Promise<Cita> => {
  const { data } = await apiClient.post<Cita>('/api/appointment', payload);
  return data;
};

export const patchCita = async (
  id: string,
  payload: UpdateCitaPayload,
): Promise<Cita> => {
  const { data } = await apiClient.patch<Cita>(
    `/api/appointment/${id}`,
    payload,
  );
  return data;
};

export const deleteCita = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/appointment/${id}`);
};
