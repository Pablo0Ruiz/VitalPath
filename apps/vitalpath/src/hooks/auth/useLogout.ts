import { useAuth } from '@/src/context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';
import { ACCESS_TOKEN_KEY } from '@/src/context/AuthContext';

export const useLogout = () => {
  const { clearSession } = useAuth();
  const queryClient = useQueryClient();

  const logout = async () => {
    clearSession();
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    queryClient.clear();
  };

  return { logout };
};
