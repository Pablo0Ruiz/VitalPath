import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getCitas,
  postCita,
  patchCita,
  deleteCita,
  type CreateCitaPayload,
  type UpdateCitaPayload,
} from '@/src/core/actions/appointments/appointments.actions';

export const CITAS_QUERY_KEY = ['citas'] as const;

export const useCitas = () => {
  return useQuery({
    queryKey: CITAS_QUERY_KEY,
    queryFn: getCitas,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateCita = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCitaPayload) => postCita(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CITAS_QUERY_KEY });
    },
    onError: error => {
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
      queryClient.invalidateQueries({ queryKey: CITAS_QUERY_KEY });
    },
    onError: error => {
      console.error('[useUpdateCita] Error al actualizar cita:', error);
    },
  });
};

export const useCancelCita = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCita(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CITAS_QUERY_KEY });
    },
    onError: error => {
      console.error('[useCancelCita] Error al cancelar cita:', error);
    },
  });
};
