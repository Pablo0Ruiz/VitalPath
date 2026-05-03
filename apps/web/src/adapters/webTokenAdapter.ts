import { ACCESS_TOKEN_KEY } from '@repo/api-client';
import { getCookie } from '../lib/get-cookie';
import type { TokenAdapter } from '@repo/types';

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
};

export const webTokenAdapter: TokenAdapter = {
  getToken: async () => getCookie(ACCESS_TOKEN_KEY),
  setToken: async (token: string) => {
    document.cookie = `${ACCESS_TOKEN_KEY}=${encodeURIComponent(token)}; path=/; SameSite=Lax`;
  },
  deleteToken: async () => deleteCookie(ACCESS_TOKEN_KEY),
  navigate: (route: string) => {
    window.location.href = route;
  },
};
