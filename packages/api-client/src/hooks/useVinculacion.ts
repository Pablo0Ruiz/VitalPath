import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getMisCuidadores,
  getMisPacientes,
  patchRevocarVinculacion,
  postGenerarCodigo,
  postVincular,
} from '../actions/vinculacion.actions';
import type { VincularPayload } from '@repo/types';
import { vinculacionKeys } from '../queryKeys';

export const useMisPacientes = () => {
  return useQuery({
    queryKey: vinculacionKeys.misPacientes(),
    queryFn: getMisPacientes,
    staleTime: 1000 * 60 * 2,
  });
};

export const useMisCuidadores = () => {
  return useQuery({
    queryKey: vinculacionKeys.misCuidadores(),
    queryFn: getMisCuidadores,
    staleTime: 1000 * 60 * 2,
  });
};

export const useGenerarCodigo = () => {
  return useMutation({
    mutationFn: postGenerarCodigo,
    onError: (error: unknown) => {
      console.error('[useGenerarCodigo] Error al generar código:', error);
    },
  });
};

export const useVincular = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: VincularPayload) => postVincular(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vinculacionKeys.all });
    },
    onError: (error: unknown) => {
      console.error('[useVincular] Error al vincular:', error);
    },
  });
};

export const useRevocarVinculacion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vinculacionId: string) =>
      patchRevocarVinculacion(vinculacionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vinculacionKeys.all });
    },
    onError: (error: unknown) => {
      console.error(
        '[useRevocarVinculacion] Error al revocar vinculación:',
        error,
      );
    },
  });
};
