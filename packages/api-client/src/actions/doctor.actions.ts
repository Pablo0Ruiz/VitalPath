import { apiClient } from '../client';

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

export interface UploadContext {
  paciente_ID?: string;
  cita_ID?: string;
}

export interface DoctorSchedulePayload {
  doctorUserId: string;
  slots: string[];
}

export interface DoctorWithSlots {
  _id: string;
  slots: string[];
  user: {
    _id: string;
    name: string;
    lastName: string;
    email: string;
  };
}

export const patchDoctorSchedule = async (
  payload: DoctorSchedulePayload,
): Promise<DoctorWithSlots> => {
  const { data } = await apiClient.patch<DoctorWithSlots>(
    `/api/hospitals/doctors/${payload.doctorUserId}/schedule`,
    { slots: payload.slots },
  );
  return data;
};

export const uploadFile = async (file: File, ctx: UploadContext) => {
  const formData = new FormData();
  formData.append('files', file);
  formData.append('paciente_ID', ctx.paciente_ID ?? '');
  formData.append('cita_ID', ctx.cita_ID ?? '');
  await apiClient.post('/api/storage/upload-file', formData);
};
