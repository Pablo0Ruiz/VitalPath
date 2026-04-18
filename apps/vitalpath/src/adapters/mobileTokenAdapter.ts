import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

import { ACCESS_TOKEN_KEY } from '@repo/api-client';
import type { TokenAdapter } from '@repo/types';

export const mobileTokenAdapter: TokenAdapter = {
  getToken: () => SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
  setToken: (token: string) =>
    SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token),
  deleteToken: () => SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
  navigate: (route: string) => router.replace(route as any),
};
