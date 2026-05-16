import { useMutation } from '@tanstack/react-query';
import type { TokenAdapter, UserSession } from '@repo/types';
import { postLogin } from '../actions/auth.actions';

interface LoginCallbacks {
  setSession: (user: UserSession) => void;
}

export const useLogin = (
  adapter: TokenAdapter,
  callbacks: LoginCallbacks,
  options: { successRoute: string },
) => {
  return useMutation({
    mutationFn: postLogin,
    onSuccess: async data => {
      await adapter.setToken(data.accessToken);
      callbacks.setSession(data.user);
      adapter.navigate(options.successRoute);
    },
    onError: error => {
      console.error('[useLogin] Error al iniciar sesión:', error);
    },
  });
};
