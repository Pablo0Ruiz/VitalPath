import { apiClient } from '../client';
import type {
  GenerarCodigoResponse,
  Vinculacion,
  VinculacionConCuidador,
  VinculacionConPaciente,
  VincularPayload,
} from '@repo/types';

export const postGenerarCodigo = async (): Promise<GenerarCodigoResponse> => {
  const { data } = await apiClient.post<GenerarCodigoResponse>(
    '/api/vinculacion/generar-codigo',
  );
  return data;
};

export const postVincular = async (
  payload: VincularPayload,
): Promise<Vinculacion> => {
  const { data } = await apiClient.post<Vinculacion>(
    '/api/vinculacion/vincular',
    payload,
  );
  return data;
};

export const patchRevocarVinculacion = async (
  vinculacionId: string,
): Promise<Vinculacion> => {
  const { data } = await apiClient.patch<Vinculacion>(
    `/api/vinculacion/${vinculacionId}/revocar`,
  );
  return data;
};

export const getMisPacientes = async (): Promise<VinculacionConPaciente[]> => {
  const { data } = await apiClient.get<VinculacionConPaciente[]>(
    '/api/vinculacion/mis-pacientes',
  );
  return data;
};

export const getMisCuidadores = async (): Promise<VinculacionConCuidador[]> => {
  const { data } = await apiClient.get<VinculacionConCuidador[]>(
    '/api/vinculacion/mis-cuidadores',
  );
  return data;
};
