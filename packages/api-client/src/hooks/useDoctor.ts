import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getDoctors, inviteDoctor } from '../actions/doctor.actions';
import { doctorKeys } from '../queryKeys';

export const useDoctors = () => {
  return useQuery({
    queryKey: doctorKeys.list(),
    queryFn: getDoctors,
    staleTime: 0,
  });
};

export const useInviteDoctor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (doctorId: string) => inviteDoctor(doctorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: doctorKeys.all });
    },
    onError: (error: unknown) => {
      console.error('[useInviteDoctor] Error al invitar doctor:', error);
    },
  });
};
