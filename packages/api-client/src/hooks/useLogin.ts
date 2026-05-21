import { useMutation } from '@tanstack/react-query';
import type { TokenAdapter, UserSession } from '@repo/types';
import { postLogin } from '../actions/auth.actions';

interface LoginCallbacks {
  setSession: (user: UserSession) => void;
  onRoleError?: (title: string, message: string) => void;
}

export const useLogin = (
  adapter: TokenAdapter,
  callbacks: LoginCallbacks,
  options: { successRoute: string },
) => {
  return useMutation({
    mutationFn: postLogin,
    onSuccess: async data => {
      if (data.user.role === 'medico') {
        callbacks.onRoleError?.(
          'Error',
          'Solo los pacientes pueden iniciar sesión en esta aplicación.',
        );
        return undefined;
      }
      await adapter.setToken(data.accessToken);
      if (data.refreshToken) await adapter.setRefreshToken(data.refreshToken);
      callbacks.setSession(data.user);
      adapter.navigate(options.successRoute);
    },
    onError: error => {
      console.error('[useLogin] Error al iniciar sesión:', error);
    },
  });
};
