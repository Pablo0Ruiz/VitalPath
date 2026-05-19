export * from './registerStore';
export * from './chatContext.store';
export * from './auth.store';
export * from './activePaciente.store';
export type { StorageAdapter } from './storage.adapter';

import type { StorageAdapter } from './storage.adapter';
import { createAuthStore } from './auth.store';
import { createActivePacienteStore } from './activePaciente.store';

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
export const useActivePacienteStore =
  createActivePacienteStore(inMemoryAdapter);
