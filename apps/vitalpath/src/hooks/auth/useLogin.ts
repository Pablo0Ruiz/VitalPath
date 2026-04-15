import { useMutation } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

import { useAuth, ACCESS_TOKEN_KEY } from '@/src/context/AuthContext';
import postLogin from '@/src/core/actions/auth-actions/login';
import { ROUTES } from '@/src/routes/routes';

export const useLogin = () => {
  const { setSession } = useAuth();

  return useMutation({
    mutationFn: postLogin,
    onSuccess: async data => {
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, data.token);
      setSession(data.user);
      router.replace(ROUTES.HOME);
    },
    onError: error => {
      console.error('Error al iniciar sesión:', error);
    },
  });
};
