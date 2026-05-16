export * from './registerStore';
export * from './chatContext.store';
export * from './auth.store';
export type { StorageAdapter } from './storage.adapter';

// Default in-memory adapter for web/SSR contexts (no native storage required).
// Web session state is rehydrated from the httpOnly cookie via useSession,
// so persistent local storage is not needed.
import type { StorageAdapter } from './storage.adapter';
import { createAuthStore } from './auth.store';

const _memStore: Record<string, string> = {};
const inMemoryAdapter: StorageAdapter = {
  getItem: async key => _memStore[key] ?? null,
  setItem: async (key, value) => {
    _memStore[key] = value;
  },
  removeItem: async key => {
    delete _memStore[key];
  },
};

export const useAuthStore = createAuthStore(inMemoryAdapter);
