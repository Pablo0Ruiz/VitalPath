import { useMutation } from '@tanstack/react-query';
import type { TokenAdapter, UserSession } from '@repo/types';
import { postLoginWithCode } from '../actions/auth.actions';

interface LoginWithCodeCallbacks {
  setSession: (user: UserSession) => void;
  afterSuccess: (user: UserSession) => void;
}

export const useLoginWithCode = (
  adapter: TokenAdapter,
  callbacks: LoginWithCodeCallbacks,
) => {
  return useMutation({
    mutationFn: postLoginWithCode,
    onSuccess: async data => {
      await adapter.setToken(data.accessToken);
      callbacks.setSession(data.user);
      callbacks.afterSuccess(data.user);
    },
    onError: error => {
      console.error('[useLoginWithCode] Error:', error);
    },
  });
};
