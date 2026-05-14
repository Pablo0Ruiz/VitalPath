import type { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import type { TokenAdapter } from '@repo/types';

export interface RefreshInterceptorOptions {
  /** Returns the currently registered adapter (may be null if not yet set). */
  getAdapter: () => TokenAdapter | null;
  /** URL for the refresh call, e.g. '/api/auth/refresh' or '/api/auth/refresh-mobile'. */
  refreshUrl: string;
  /**
   * When true the refresh call sends `{ refreshToken }` in the body and reads
   * `{ accessToken, refreshToken }` back (mobile body-based flow).
   * When false the refresh call relies on the httpOnly cookie (web cookie flow).
   */
  bodyRefresh?: boolean;
  /**
   * URL substrings that identify auth endpoints — these are never retried to
   * prevent infinite refresh loops. Defaults to common auth paths.
   */
  authEndpointPatterns?: string[];
}

// Idempotent guard — prevents double-registration when wireRefresh is called
// more than once (e.g. hot reload, StrictMode, accidental re-mount).
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
          // Use a plain axios import to avoid circular dependency — the refresh
          // call must bypass this same interceptor (it hits /auth/refresh-mobile
          // which is in authEndpointPatterns and therefore skipped anyway, but
          // using instance directly is cleaner).
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
