import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getCitas,
  postCita,
  patchCita,
  deleteCita,
  getCitasAdministrator,
  getCitasMedico,
  patchCitaEstadoWorker,
} from '../actions/appointment.actions';
import type { CreateCitaPayload, UpdateCitaPayload } from '@repo/types';
import { appointmentKeys } from '../queryKeys';

export const useCitas = (userId: string) => {
  return useQuery({
    queryKey: appointmentKeys.list(userId),
    queryFn: getCitas,
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateCita = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCitaPayload) => postCita(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
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
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
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
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
    },
    onError: (error: unknown) => {
      console.error('[useCancelCita] Error al cancelar cita:', error);
    },
  });
};

export const useCitasAdministrator = () => {
  return useQuery({
    queryKey: appointmentKeys.list('all'),
    queryFn: getCitasAdministrator,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCitasMedico = () => {
  return useQuery({
    queryKey: appointmentKeys.list('all'),
    queryFn: getCitasMedico,
    staleTime: 0,
  });
};

export const useAvanzarCitaEstado = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, estado }: { id: string; estado: string }) =>
      patchCitaEstadoWorker(id, estado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
    },
    onError: (error: unknown) => {
      console.error('[useAvanzarCitaEstado] Error al avanzar estado:', error);
    },
  });
};
