import { useMutation } from '@tanstack/react-query';
import type { TokenAdapter, UserSession } from '@repo/types';
import { postRegisterCuidador } from '../actions/auth.actions';

interface RegisterCuidadorCallbacks {
  setSession: (user: UserSession) => void;
}

export const useRegisterCuidador = (
  adapter: TokenAdapter,
  callbacks: RegisterCuidadorCallbacks,
  options: { successRoute: string },
) => {
  return useMutation({
    mutationFn: postRegisterCuidador,
    onSuccess: async data => {
      await adapter.setToken(data.accessToken);
      if (data.refreshToken) await adapter.setRefreshToken(data.refreshToken);
      callbacks.setSession(data.user);
      adapter.navigate(options.successRoute);
    },
    onError: (error: any) => {
      console.error(
        '[useRegisterCuidador] Error al registrarse:',
        error.response?.data || error.message,
      );
    },
  });
};
