import { useMutation } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

import { useAuth, ACCESS_TOKEN_KEY } from '@/src/context/AuthContext';
import { postRegister } from '@/src/core/actions/auth-actions/register.action';
import { ROUTES } from '@/src/routes/routes';

export const useRegister = () => {
  const { setSession } = useAuth();

  return useMutation({
    mutationFn: postRegister,
    onSuccess: async data => {
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, data.token);
      setSession(data.user);
      router.replace(ROUTES.HOME);
    },
    onError: (error: any) => {
      console.error(
        'Error al registrarse:',
        error.response?.data || error.message,
      );
    },
  });
};
