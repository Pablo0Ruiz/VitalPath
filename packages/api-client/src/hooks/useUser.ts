import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { patchMe, getPatientById } from '../actions/user.actions';
import type { UserSession, IPatientProfile } from '@repo/types';
import { patientKeys } from '../queryKeys';

interface UpdateUserCallbacks {
  onSuccess?: (user: UserSession) => void;
  onError?: (error: any) => void;
}

export const useUpdateUser = (callbacks?: UpdateUserCallbacks) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchMe,
    onSuccess: data => {
      queryClient.setQueryData(['user-profile'], data);
      callbacks?.onSuccess?.(data);
    },
    onError: error => {
      console.error('[useUpdateUser] Error updating user:', error);
      callbacks?.onError?.(error);
    },
  });
};

export const usePatientById = (id?: string) => {
  return useQuery<IPatientProfile>({
    queryKey: patientKeys.detail(id ?? ''),
    queryFn: () => getPatientById(id!),
    enabled: !!id,
    staleTime: 300_000,
  });
};
