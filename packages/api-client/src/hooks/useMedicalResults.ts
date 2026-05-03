import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getMedicalResults,
  getMedicalResultsPaciente,
  uploadStudy,
} from '../actions/medical-results.actions';
import { appointmentKeys, resumeKeys } from '../queryKeys';

export const useMedicalResults = () => {
  return useQuery({
    queryKey: resumeKeys.current(),
    queryFn: () => getMedicalResults(),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

export const useMedicalResultsPaciente = () => {
  return useQuery({
    queryKey: resumeKeys.paciente(),
    queryFn: getMedicalResultsPaciente,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

export const useUploadStudy = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      file,
      ctx,
    }: {
      file: File;
      ctx: { paciente_ID: string; cita_ID?: string };
    }) => uploadStudy(file, ctx),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.all });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
    },
  });
};
