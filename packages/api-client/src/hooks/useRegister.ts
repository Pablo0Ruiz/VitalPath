import { useMutation } from '@tanstack/react-query';
import type { TokenAdapter, UserSession } from '@repo/types';
import { postRegister } from '../actions/auth.actions';

interface RegisterCallbacks {
  setSession: (user: UserSession) => void;
}

export const useRegister = (
  adapter: TokenAdapter,
  callbacks: RegisterCallbacks,
  options: { successRoute: string },
) => {
  return useMutation({
    mutationFn: postRegister,
    onSuccess: async data => {
      await adapter.setToken(data.token);
      callbacks.setSession(data.user);
      adapter.navigate(options.successRoute);
    },
    onError: (error: any) => {
      console.error(
        '[useRegister] Error al registrarse:',
        error.response?.data || error.message,
      );
    },
  });
};
