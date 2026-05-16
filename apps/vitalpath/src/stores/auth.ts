import { createAuthStore } from '@repo/store';
import { mobileStorageAdapter } from '../adapters/mobileStorageAdapter';

export const useAuthStore = createAuthStore(mobileStorageAdapter);
