import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { TokenAdapter, UserSession } from '@repo/types';
import { getMe } from '../actions/auth.actions';
import { sessionKeys } from '../queryKeys';

interface SessionCallbacks {
  setSession: (user: UserSession) => void;
  clearSession: () => void;
  setIsLoading: (value: boolean) => void;
}

export const useSession = (
  adapter: TokenAdapter,
  callbacks: SessionCallbacks,
  options?: { onSuccess?: () => void },
): void => {
  const { setSession, clearSession, setIsLoading } = callbacks;

  const { data, isError, isSuccess, isPending } = useQuery({
    queryKey: sessionKeys.current(),
    queryFn: async () => {
      const token = await adapter.getToken();
      if (!token) throw new Error('No token');
      return getMe();
    },
    retry: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (isSuccess && data) {
      setSession(data);
      options?.onSuccess?.();
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (isError) {
      clearSession();
      adapter.deleteToken();
    }
  }, [isError]);

  useEffect(() => {
    setIsLoading(isPending);
  }, [isPending]);
};
