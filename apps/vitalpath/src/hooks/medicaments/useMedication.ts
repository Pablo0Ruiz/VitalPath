import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import postCreateMedication from '@/src/core/actions/medication/create-medication.action';
import { getMedicaments } from '@/src/core/actions/medication/get-medication.action';
import patchUpdateMedication from '@/src/core/actions/medication/update-medication.action';
import {
  CreateMedicationPayload,
  UpdateMedicationPayload,
} from '@/src/interfaces/medication/medication.interface';
import deleteMedication from '@/src/core/actions/medication/delete-medication.action';

export const MEDICAMENTS_QUERY_KEY = ['medicaments'] as const;

export const useMedicaments = () => {
  return useQuery({
    queryKey: MEDICAMENTS_QUERY_KEY,
    queryFn: getMedicaments,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateMedication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMedicationPayload) =>
      postCreateMedication(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEDICAMENTS_QUERY_KEY });
    },
    onError: error => {
      console.error('[useCreateMedication] Error al crear medicamento:', error);
    },
  });
};

export const useUpdateMedication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateMedicationPayload;
    }) => patchUpdateMedication(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEDICAMENTS_QUERY_KEY });
    },
    onError: error => {
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
      queryClient.invalidateQueries({ queryKey: MEDICAMENTS_QUERY_KEY });
    },
    onError: error => {
      console.error(
        '[useDeleteMedication] Error al eliminar medicamento:',
        error,
      );
    },
  });
};
