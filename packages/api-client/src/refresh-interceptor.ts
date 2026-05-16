import type { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import type { TokenAdapter } from '@repo/types';

export interface RefreshInterceptorOptions {
  getAdapter: () => TokenAdapter | null;
  refreshUrl: string;
  bodyRefresh?: boolean;
  authEndpointPatterns?: string[];
}

const registered = new WeakSet<AxiosInstance>();

export function attachRefreshInterceptor(
  instance: AxiosInstance,
  opts: RefreshInterceptorOptions,
): void {
  if (registered.has(instance)) return;
  registered.add(instance);

  let isRefreshing = false;
  let pendingQueue: Array<(token: string | null) => void> = [];

  const flushQueue = (token: string | null): void => {
    pendingQueue.forEach(cb => cb(token));
    pendingQueue = [];
  };

  const defaultPatterns = ['/auth/refresh', '/auth/login', '/auth/register'];
  const patterns = opts.authEndpointPatterns ?? defaultPatterns;

  instance.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
      const status = error.response?.status;
      const original = error.config as AxiosRequestConfig & {
        _retry?: boolean;
      };

      const url = original?.url ?? '';
      const isAuthEndpoint = patterns.some(p => url.includes(p));

      if (status !== 401 || original._retry || isAuthEndpoint) {
        if (status && status >= 500) {
          console.error('[API-CLIENT] Error de servidor:', status, url);
        }
        return Promise.reject(error);
      }

      original._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push(token => {
            if (!token) return reject(error);
            original.headers = {
              ...original.headers,
              Authorization: `Bearer ${token}`,
            };
            resolve(instance(original));
          });
        });
      }

      isRefreshing = true;
      const adapter = opts.getAdapter();

      try {
        let accessToken: string;

        if (opts.bodyRefresh) {
          const refreshToken = adapter ? await adapter.getRefreshToken() : null;
          if (!refreshToken) throw new Error('No refresh token available');

          const { data } = await instance.post<{
            accessToken: string;
            refreshToken: string;
          }>(opts.refreshUrl, { refreshToken });
          accessToken = data.accessToken;
          if (adapter) await adapter.setRefreshToken(data.refreshToken);
        } else {
          const { data } = await instance.post<{ accessToken: string }>(
            opts.refreshUrl,
          );
          accessToken = data.accessToken;
        }

        if (adapter) await adapter.setToken(accessToken);
        flushQueue(accessToken);
        original.headers = {
          ...original.headers,
          Authorization: `Bearer ${accessToken}`,
        };
        return instance(original);
      } catch (refreshErr) {
        flushQueue(null);
        if (adapter) {
          await adapter.deleteToken();
          await adapter.deleteRefreshToken();
          adapter.navigate('/login');
        }
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    },
  );
}
