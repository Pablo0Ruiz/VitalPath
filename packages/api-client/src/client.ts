import axios from 'axios';
import type { TokenAdapter } from '@repo/types';
import { attachRefreshInterceptor } from './refresh-interceptor';

export const ACCESS_TOKEN_KEY = 'access_token';
export const REFRESH_TOKEN_KEY = 'vitalpath.refresh';

export const apiClient = axios.create({
  timeout: 30_000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export const aiApi = axios.create();

let tokenAdapter: TokenAdapter | null = null;

export const attachAuthAdapter = (adapter: TokenAdapter): void => {
  tokenAdapter = adapter;
};

export const getTokenAdapter = (): TokenAdapter | null => tokenAdapter;

export const attachAuthHeader = (
  instance: ReturnType<typeof axios.create>,
): void => {
  instance.interceptors.request.use(async config => {
    if (tokenAdapter && !config.headers.Authorization) {
      const token = await tokenAdapter.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  });
};

attachAuthHeader(apiClient);
attachAuthHeader(aiApi);

export const wireRefresh = (mode: 'cookie' | 'body'): void => {
  const opts = {
    getAdapter: () => tokenAdapter,
    refreshUrl:
      mode === 'body' ? '/api/auth/refresh-mobile' : '/api/auth/refresh',
    bodyRefresh: mode === 'body',
  };
  attachRefreshInterceptor(apiClient, opts);
  attachRefreshInterceptor(aiApi, opts);
};
