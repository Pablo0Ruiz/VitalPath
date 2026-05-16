import axios from 'axios';
import type { TokenAdapter } from '@repo/types';
import { attachRefreshInterceptor } from './refresh-interceptor';

export const ACCESS_TOKEN_KEY = 'access_token';
export const REFRESH_TOKEN_KEY = 'vitalpath.refresh';

export const apiClient = axios.create({
  timeout: 30_000,
  withCredentials: true, // required so the browser sends the httpOnly refresh cookie cross-domain
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

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

// ─── Auth header helper ────────────────────────────────────────────────────────
// Attaches Authorization: Bearer to any Axios instance using the current adapter.
// Applied to both apiClient and aiApi so all requests carry the token.

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

// ─── wireRefresh ──────────────────────────────────────────────────────────────
// Called ONCE at app boot. Registers the refresh interceptor on both instances.
// mode 'cookie' → web httpOnly cookie flow (no body refresh token)
// mode 'body'   → mobile body-based flow (reads/writes adapter refresh token)

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
