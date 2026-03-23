import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'access_token';

export const myApi = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000',
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

myApi.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      console.error('[API] Error al obtener el token');
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

myApi.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 401) {
      await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    }

    if (status === 403) {
      console.warn('[API] Acceso denegado:', error.config?.url);
    }

    if (status && status >= 500) {
      console.error('[API] Error de servidor:', status, error.config?.url);
    }

    return Promise.reject(error);
  },
);
