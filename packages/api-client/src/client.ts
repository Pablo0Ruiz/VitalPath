import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import type { TokenAdapter } from '@repo/types';

export const ACCESS_TOKEN_KEY = 'access_token';

export const apiClient = axios.create({
  timeout: 30_000,
  withCredentials: true, // required so the browser sends the httpOnly refresh cookie cross-domain
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// TODO(sprint5): add 401 interceptor to aiApi (out of scope for sprint 4)
export const aiApi = axios.create();

// ─── Auth adapter ─────────────────────────────────────────────────────────────

// Host apps (web, mobile) register their token adapter once at boot via attachAuthAdapter.
// The interceptor below uses the adapter to read/write the access token and navigate on hard logout.
// Without an adapter the interceptor still refreshes and retries — it just can not propagate
// the new access token to the host storage. That is intentional: keeps apiClient host-agnostic.

let tokenAdapter: TokenAdapter | null = null;

export const attachAuthAdapter = (adapter: TokenAdapter): void => {
  tokenAdapter = adapter;
};

// ─── Request interceptor ──────────────────────────────────────────────────────
// Attaches Authorization header if the adapter has a stored token and the
// request does not already carry one (avoids overwriting explicit overrides).

apiClient.interceptors.request.use(async config => {
  if (tokenAdapter && !config.headers.Authorization) {
    const token = await tokenAdapter.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ─── Response interceptor — 401 refresh with concurrent-request queue ─────────

let isRefreshing = false;
let pendingQueue: Array<(token: string | null) => void> = [];

const flushQueue = (token: string | null): void => {
  pendingQueue.forEach(cb => cb(token));
  pendingQueue = [];
};

apiClient.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const original = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // Never trigger a refresh on auth endpoints — avoids infinite loops
    const url = original?.url ?? '';
    const isAuthEndpoint =
      url.includes('/auth/refresh') ||
      url.includes('/auth/login') ||
      url.includes('/auth/register');

    if (status === 401 && !original._retry && !isAuthEndpoint) {
      original._retry = true;

      if (isRefreshing) {
        // Another request is already refreshing — queue this one and resolve when done
        return new Promise((resolve, reject) => {
          pendingQueue.push(token => {
            if (!token) return reject(error);
            original.headers = {
              ...original.headers,
              Authorization: `Bearer ${token}`,
            };
            resolve(apiClient(original));
          });
        });
      }

      isRefreshing = true;
      try {
        const { data } = await apiClient.post<{ accessToken: string }>(
          '/api/auth/refresh',
        );
        if (tokenAdapter) await tokenAdapter.setToken(data.accessToken);
        flushQueue(data.accessToken);
        original.headers = {
          ...original.headers,
          Authorization: `Bearer ${data.accessToken}`,
        };
        return apiClient(original);
      } catch (refreshErr) {
        flushQueue(null);
        if (tokenAdapter) {
          await tokenAdapter.deleteToken();
          tokenAdapter.navigate('/login');
        }
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    if (status && status >= 500) {
      console.error('[API-CLIENT] Error de servidor:', status, original?.url);
    }
    return Promise.reject(error);
  },
);
