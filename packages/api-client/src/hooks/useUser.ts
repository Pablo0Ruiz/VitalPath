import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchMe } from '../actions/user.actions';
import type { UserSession } from '@repo/types';

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
