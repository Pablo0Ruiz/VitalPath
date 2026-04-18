import { useMutation } from '@tanstack/react-query';
import type { InviteDoctorDto, TokenAdapter, UserSession } from '@repo/types';
import { postInviteVerification, postLogin } from '../actions/auth.actions';

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
      await adapter.setToken(data.token);
      callbacks.setSession(data.user);
      adapter.navigate(options.successRoute);
    },
    onError: error => {
      console.error('[useLogin] Error al iniciar sesión:', error);
    },
  });
};
