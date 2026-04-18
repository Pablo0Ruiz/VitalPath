import { apiClient } from '../client';
import type { UserSession } from '@repo/types';

export interface DoctorSession extends Omit<UserSession, 'id'> {
  _id: string;
  especialidad: string;
  isActive: boolean;
}

export const getDoctors = async (): Promise<DoctorSession[]> => {
  const { data } = await apiClient.get<DoctorSession[]>(
    '/api/hospitals/doctors',
  );
  return data;
};

export const inviteDoctor = async (doctorId: string): Promise<void> => {
  await apiClient.post<void>(`/api/hospitals/doctors/${doctorId}/invite`);
};
