import { ACCESS_TOKEN_KEY } from '@repo/api-client';
import { getCookie, clearAllCookies } from '../lib/get-cookie';
import type { TokenAdapter } from '@repo/types';

export const webTokenAdapter: TokenAdapter = {
  getToken: async () => getCookie(ACCESS_TOKEN_KEY),
  setToken: async (token: string) => {
    document.cookie = `${ACCESS_TOKEN_KEY}=${encodeURIComponent(token)}; path=/; SameSite=Lax`;
  },
  deleteToken: async () => clearAllCookies(),
  navigate: (route: string) => {
    window.location.href = route;
  },
};
