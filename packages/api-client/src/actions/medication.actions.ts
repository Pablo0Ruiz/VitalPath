import { apiClient } from '../client';
import type {
  Medication,
  CreateMedicationPayload,
  UpdateMedicationPayload,
} from '@repo/types';

export const getMedicaments = async (): Promise<Medication[]> => {
  const { data } = await apiClient.get<Medication[]>('/api/medications');
  return data;
};

export const getMedicament = async (id: string): Promise<Medication> => {
  const { data } = await apiClient.get<Medication>(`/api/medications/${id}`);
  return data;
};

export const createMedication = async (
  payload: CreateMedicationPayload,
): Promise<Medication> => {
  const { data } = await apiClient.post<Medication>(
    '/api/medications',
    payload,
  );
  return data;
};

export const updateMedication = async (
  payload: UpdateMedicationPayload,
): Promise<Medication> => {
  const { id, ...body } = payload;
  const { data } = await apiClient.patch<Medication>(
    `/api/medications/${id}`,
    body,
  );
  return data;
};

export const deleteMedication = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/medications/${id}`);
};

export const getMedicationsByPatient = async (
  id: string,
): Promise<Medication[]> => {
  const { data } = await apiClient.get<Medication[]>(
    `/api/medications/patient/${id}`,
  );
  return data;
};
