import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

import { useAuth, ACCESS_TOKEN_KEY } from '@/src/context/AuthContext';
import { getMe } from '@/src/core/actions/auth-actions/getMe';
import { ROUTES } from '@/src/routes/routes';

export const useSession = () => {
  const { setSession, clearSession, setIsLoading } = useAuth();

  const { data, isError, isSuccess, isPending } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
      if (!token) throw new Error('No token');
      return getMe();
    },
    retry: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (isSuccess && data) {
      setSession(data);
      router.replace(ROUTES.HOME);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (isError) {
      clearSession();
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    }
  }, [isError]);

  useEffect(() => {
    setIsLoading(isPending);
  }, [isPending]);
};
