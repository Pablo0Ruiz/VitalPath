import { apiClient, ACCESS_TOKEN_KEY } from '@repo/api-client';
import type {
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';
import { useAuthStore } from '@repo/store';
import { getCookie } from './get-cookie';

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
};

export const setupWebApi = () => {
  apiClient.defaults.baseURL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getCookie(ACCESS_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401 && typeof window !== 'undefined') {
        useAuthStore.getState().clearSession();
        deleteCookie(ACCESS_TOKEN_KEY);
        window.location.href = '/login';
      }
      return Promise.reject(error);
    },
  );
};
