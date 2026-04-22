import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getCitas,
  postCita,
  patchCita,
  deleteCita,
} from '../actions/appointment.actions';
import type { CreateCitaPayload, UpdateCitaPayload } from '@repo/types';

export const CITAS_QUERY_KEY = (userId: string) => ['citas', userId] as const;

export const useCitas = (userId: string) => {
  return useQuery({
    queryKey: CITAS_QUERY_KEY(userId),
    queryFn: getCitas,
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
};

export const CITAS_BASE_KEY = ['citas'] as const;

export const useCreateCita = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCitaPayload) => postCita(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CITAS_BASE_KEY });
    },
    onError: (error: unknown) => {
      console.error('[useCreateCita] Error al crear cita:', error);
    },
  });
};

export const useUpdateCita = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCitaPayload }) =>
      patchCita(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CITAS_BASE_KEY });
    },
    onError: (error: unknown) => {
      console.error('[useUpdateCita] Error al actualizar cita:', error);
    },
  });
};

export const useCancelCita = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCita(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CITAS_BASE_KEY });
    },
    onError: (error: unknown) => {
      console.error('[useCancelCita] Error al cancelar cita:', error);
    },
  });
};
