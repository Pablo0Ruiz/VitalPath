import { myApi } from '../../api/myApi';
import {
  CreateCitaPayload,
  Cita,
  UpdateCitaPayload,
} from '@/src/interfaces/appointments/appointments.interface';

export const postCita = async (payload: CreateCitaPayload): Promise<Cita> => {
  console.log('Payolad Citas:', payload);
  const { data } = await myApi.post<Cita>('/api/appointment', payload);
  return data;
};

export const getCitas = async (): Promise<Cita[]> => {
  const { data } = await myApi.get<Cita[]>('/api/appointment');
  return data;
};

export const getCitaById = async (id: string): Promise<Cita> => {
  const { data } = await myApi.get<Cita>(`/api/appointment/${id}`);
  return data;
};

export const patchCita = async (
  id: string,
  payload: UpdateCitaPayload,
): Promise<Cita> => {
  const { data } = await myApi.patch<Cita>(`/api/appointment/${id}`, payload);
  return data;
};

export const deleteCita = async (id: string): Promise<Cita> => {
  const { data } = await myApi.delete<Cita>(`/api/appointment/${id}`);
  return data;
};
