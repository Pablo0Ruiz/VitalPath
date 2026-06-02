import type {
  CreateMedicationPayload,
  Medication,
  TakeMedicationResponse,
  UpdateMedicationPayload,
} from '@repo/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createMedication,
  deleteMedication,
  getMedicament,
  getMedicaments,
  getMedicationsByPatient,
  takeMedication,
  updateMedication,
} from '../actions/medication.actions';
import { medicationKeys } from '../queryKeys';
import { handleApiError } from '../error-handler';

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
      handleApiError(error);
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
      handleApiError(error);
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
      handleApiError(error);
    },
  });
};

export const useTakeMedication = () => {
  const queryClient = useQueryClient();

  return useMutation<TakeMedicationResponse, Error, string>({
    mutationFn: (id: string) => takeMedication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: medicationKeys.all });
    },
    onError: (error: unknown) => {
      handleApiError(error);
    },
  });
};

export const useMedicationsByPatient = (id?: string) => {
  return useQuery<Medication[]>({
    queryKey: [...medicationKeys.all, 'patient', id],
    queryFn: () => getMedicationsByPatient(id!),
    enabled: !!id,
    staleTime: 300_000,
  });
};
