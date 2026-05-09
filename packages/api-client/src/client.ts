import axios, { AxiosError } from 'axios';

export const ACCESS_TOKEN_KEY = 'access_token';

export const apiClient = axios.create({
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export const geminiApi = axios.create();

apiClient.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    if (status && status >= 500) {
      console.error(
        '[API-CLIENT] Error de servidor:',
        status,
        error.config?.url,
      );
    }
    return Promise.reject(error);
  },
);
