import { apiClient, ACCESS_TOKEN_KEY } from '@repo/api-client';
import { useAuthStore } from '@/src/stores/auth';
import * as SecureStore from 'expo-secure-store';

export const setupApiInterceptors = () => {
  apiClient.defaults.baseURL =
    process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

  apiClient.interceptors.request.use(
    async config => {
      try {
        const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('[API SETUP] Error al obtener el token:', error);
      }
      return config;
    },
    error => Promise.reject(error),
  );

  apiClient.interceptors.response.use(
    response => response,
    async error => {
      if (error.response?.status === 401) {
        useAuthStore.getState().clearSession();
        await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
      }
      return Promise.reject(error);
    },
  );
};
