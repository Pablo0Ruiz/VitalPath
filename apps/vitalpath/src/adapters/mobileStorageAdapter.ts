import * as SecureStore from 'expo-secure-store';
import type { StorageAdapter } from '@repo/store';

export const mobileStorageAdapter: StorageAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};
