import { AxiosResponse } from 'axios';
import { apiClient } from '../client';
import type {
  LoginCredentials,
  UserCredentials,
  UserSession,
  RegisterCredentials,
  InviteDoctorDto,
} from '@repo/types';

export const postLogin = async (
  credentials: LoginCredentials,
): Promise<UserCredentials> => {
  const { data } = await apiClient.post<UserCredentials>(
    '/api/auth/login',
    credentials,
  );
  return data;
};

export const getMe = async (): Promise<UserSession> => {
  const { data } = await apiClient.get<UserSession>('/api/user/me');
  return data;
};

export interface RecoverPasswordResponse {
  message: string;
}

export const postRecoverPassword = async (
  email: string,
): Promise<AxiosResponse<RecoverPasswordResponse>> => {
  const response = await apiClient.post<RecoverPasswordResponse>(
    '/api/auth/recover-password',
    { email },
  );
  return response;
};

export const postRegister = async (
  credentials: RegisterCredentials,
): Promise<UserCredentials> => {
  const [day, month, year] = credentials.fechaNacimiento.split('/');
  const formattedDate = `${month}/${day}/${year}`;

  const payload = {
    ...credentials,
    fechaNacimiento: formattedDate,
  };
  const { data } = await apiClient.post<UserCredentials>(
    '/api/auth/register',
    payload,
  );
  return data;
};

export interface RegisterPatientByWorkerPayload {
  name: string;
  lastName: string;
  email: string;
  password: string;
  fechaNacimiento: string; // DD/MM/YYYY
  genero: 'Masculino' | 'Femenino' | 'Otro';
  centroSalud_ID?: string;
}

export interface CreatedPatientResponse {
  _id: string;
  name: string;
  lastName: string;
  email: string;
  role: string;
}

export const postRegisterPatientByWorker = async (
  payload: RegisterPatientByWorkerPayload,
): Promise<CreatedPatientResponse> => {
  const { data } = await apiClient.post<CreatedPatientResponse>(
    '/api/auth/register-patient',
    payload,
  );
  return data;
};

export const postLoginWithCode = async (
  codigo: string,
): Promise<UserCredentials> => {
  const { data } = await apiClient.post<UserCredentials>(
    `/api/auth/login/code/${codigo}`,
  );
  return data;
};

export const postInviteVerification = async (
  payload: InviteDoctorDto,
): Promise<UserCredentials> => {
  const { data } = await apiClient.post<UserCredentials>(
    `/api/auth/verify-doctor/${payload.codigoVerificacion}`,
    { email: payload.email, role: payload.role },
  );
  return data;
};
