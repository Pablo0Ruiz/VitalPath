import { apiClient } from '../client';
import type { Cita, CreateCitaPayload, UpdateCitaPayload } from '@repo/types';

export const getCitas = async (): Promise<Cita[]> => {
  const { data } = await apiClient.get<Cita[]>('/api/appointment');
  return data;
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
