import * as SecureStore from 'expo-secure-store';
import { router, type Href } from 'expo-router';

import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@repo/api-client';
import type { TokenAdapter } from '@repo/types';

export const mobileTokenAdapter: TokenAdapter = {
  getToken: () => SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
  setToken: (token: string) =>
    SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token),
  deleteToken: () => SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
  getRefreshToken: () => SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
  setRefreshToken: (token: string) =>
    SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token),
  deleteRefreshToken: () => SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
  navigate: (route: string) => router.replace(route as Href),
};
