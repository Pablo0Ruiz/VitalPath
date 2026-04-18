import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getDoctors, inviteDoctor } from '../actions/doctor.actions';

export const DOCTORS_QUERY_KEY = ['doctors'] as const;

export const useDoctors = () => {
  return useQuery({
    queryKey: DOCTORS_QUERY_KEY,
    queryFn: getDoctors,
    staleTime: 1000 * 60 * 5,
  });
};

export const useInviteDoctor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (doctorId: string) => inviteDoctor(doctorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOCTORS_QUERY_KEY });
    },
    onError: (error: unknown) => {
      console.error('[useInviteDoctor] Error al invitar doctor:', error);
    },
  });
};
