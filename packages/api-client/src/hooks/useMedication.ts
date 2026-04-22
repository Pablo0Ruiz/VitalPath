import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getMedicament,
  getMedicaments,
  createMedication,
  updateMedication,
  deleteMedication,
} from '../actions/medication.actions';
import type {
  CreateMedicationPayload,
  UpdateMedicationPayload,
} from '@repo/types';
import { medicationKeys } from '../queryKeys';

export const useMedicaments = () => {
  return useQuery({
    queryKey: medicationKeys.list(),
    queryFn: () => getMedicaments(),
    staleTime: 1000 * 60 * 5,
  });
};

export const useMedicament = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: medicationKeys.detail(id),
    queryFn: () => getMedicament(id),
    staleTime: 1000 * 60 * 5,
    enabled,
  });
};

export const useCreateMedication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMedicationPayload) => createMedication(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: medicationKeys.all });
    },
    onError: (error: unknown) => {
      console.error('[useCreateMedication] Error al crear medicamento:', error);
    },
  });
};

export const useUpdateMedication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateMedicationPayload) => updateMedication(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: medicationKeys.all });
    },
    onError: (error: unknown) => {
      console.error(
        '[useUpdateMedication] Error al actualizar medicamento:',
        error,
      );
    },
  });
};

export const useDeleteMedication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMedication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: medicationKeys.all });
    },
    onError: (error: unknown) => {
      console.error(
        '[useDeleteMedication] Error al eliminar medicamento:',
        error,
      );
    },
  });
};
