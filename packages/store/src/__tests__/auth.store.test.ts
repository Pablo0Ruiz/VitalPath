import { describe, it, expect, beforeEach } from 'vitest';
import type { StorageAdapter } from '../storage.adapter';
import { createAuthStore } from '../auth.store';

// In-memory mock adapter for tests
const createMockStorageAdapter = (): StorageAdapter & {
  store: Record<string, string>;
} => {
  const store: Record<string, string> = {};
  return {
    store,
    getItem: async (key: string) => store[key] ?? null,
    setItem: async (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: async (key: string) => {
      delete store[key];
    },
  };
};

describe('auth.store — setSession role normalization', () => {
  let mockAdapter: ReturnType<typeof createMockStorageAdapter>;
  let store: ReturnType<typeof createAuthStore>;

  const baseUser = {
    _id: 'user-1',
    name: 'Test',
    email: 'test@example.com',
  };

  beforeEach(() => {
    mockAdapter = createMockStorageAdapter();
    store = createAuthStore(mockAdapter);
    store.setState({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      _hasHydrated: false,
    });
  });

  it('normalizes uppercase MEDICO to medico when setSession is called', () => {
    store.getState().setSession({ ...baseUser, role: 'MEDICO' as any });
    expect(store.getState().user?.role).toBe('medico');
  });

  it('normalizes uppercase CUIDADOR_FAMILIAR to cuidador_familiar', () => {
    store
      .getState()
      .setSession({ ...baseUser, role: 'CUIDADOR_FAMILIAR' as any });
    expect(store.getState().user?.role).toBe('cuidador_familiar');
  });

  it('passes through already-lowercase medico unchanged', () => {
    store.getState().setSession({ ...baseUser, role: 'medico' });
    expect(store.getState().user?.role).toBe('medico');
  });

  it('stores null for an unknown garbage role', () => {
    store.getState().setSession({ ...baseUser, role: 'garbage' as any });
    expect(store.getState().user?.role).toBeUndefined();
  });

  it('stores undefined when role is undefined', () => {
    store.getState().setSession({ ...baseUser, role: undefined });
    expect(store.getState().user?.role).toBeUndefined();
  });

  it('sets isAuthenticated to true after setSession', () => {
    store.getState().setSession({ ...baseUser, role: 'paciente' });
    expect(store.getState().isAuthenticated).toBe(true);
  });
});
