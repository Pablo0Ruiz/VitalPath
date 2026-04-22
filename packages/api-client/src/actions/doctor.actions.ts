import { apiClient } from '../client';
import type { UserSession } from '@repo/types';

export interface HealthCenter {
  _id: string;
  nombre: string;
  direccion: string;
  tipo: string;
  listaMedicos_ID: string[];
  listaTrabajadores_ID: string[];
  codigoVinculacion: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface DoctorSession {
  _id: string;
  especialidad: string;
  slots: string[];
  citas: any[];
  user: {
    _id: string;
    name: string;
    lastName: string;
    email: string;
    role: string;
    isActive: boolean;
    genero: string;
    centroSalud_ID?: HealthCenter;
    fechaNacimiento: string;
  };
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
