import { describe, it, expect, beforeEach } from 'vitest';
import type { StorageAdapter } from '../storage.adapter';
import { createActivePacienteStore } from '../activePaciente.store';

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

describe('activePaciente.store', () => {
  let mockAdapter: ReturnType<typeof createMockStorageAdapter>;
  let store: ReturnType<typeof createActivePacienteStore>;

  beforeEach(() => {
    mockAdapter = createMockStorageAdapter();
    store = createActivePacienteStore(mockAdapter);
    // Reset state between tests
    store.setState({
      activePacienteId: null,
      activePacienteNombre: null,
      _hasHydrated: false,
    });
  });

  describe('initial state', () => {
    it('should initialize with activePacienteId as null', () => {
      expect(store.getState().activePacienteId).toBeNull();
    });

    it('should initialize with activePacienteNombre as null', () => {
      expect(store.getState().activePacienteNombre).toBeNull();
    });

    it('should expose setActivePaciente action', () => {
      expect(typeof store.getState().setActivePaciente).toBe('function');
    });

    it('should expose clearActivePaciente action', () => {
      expect(typeof store.getState().clearActivePaciente).toBe('function');
    });
  });

  describe('setActivePaciente', () => {
    it('should update activePacienteId with the provided id', () => {
      store.getState().setActivePaciente({ id: 'p1', nombre: 'Juan García' });
      expect(store.getState().activePacienteId).toBe('p1');
    });

    it('should update activePacienteNombre with the provided nombre', () => {
      store.getState().setActivePaciente({ id: 'p1', nombre: 'Juan García' });
      expect(store.getState().activePacienteNombre).toBe('Juan García');
    });

    it('should update both id and nombre atomically', () => {
      store.getState().setActivePaciente({ id: 'p2', nombre: 'Ana López' });
      const state = store.getState();
      expect(state.activePacienteId).toBe('p2');
      expect(state.activePacienteNombre).toBe('Ana López');
    });

    it('should overwrite previous active patient when called again', () => {
      store.getState().setActivePaciente({ id: 'p1', nombre: 'Juan García' });
      store.getState().setActivePaciente({ id: 'p2', nombre: 'Ana López' });
      const state = store.getState();
      expect(state.activePacienteId).toBe('p2');
      expect(state.activePacienteNombre).toBe('Ana López');
    });
  });

  describe('clearActivePaciente', () => {
    it('should reset activePacienteId to null', () => {
      store.getState().setActivePaciente({ id: 'p1', nombre: 'Juan García' });
      store.getState().clearActivePaciente();
      expect(store.getState().activePacienteId).toBeNull();
    });

    it('should reset activePacienteNombre to null', () => {
      store.getState().setActivePaciente({ id: 'p1', nombre: 'Juan García' });
      store.getState().clearActivePaciente();
      expect(store.getState().activePacienteNombre).toBeNull();
    });

    it('should be a no-op when called on an already-clear store', () => {
      store.getState().clearActivePaciente();
      const state = store.getState();
      expect(state.activePacienteId).toBeNull();
      expect(state.activePacienteNombre).toBeNull();
    });
  });

  describe('persistence — storage key', () => {
    it('should use "active-paciente-store" as the persist key', async () => {
      store.getState().setActivePaciente({ id: 'p1', nombre: 'Juan García' });
      // Zustand persist writes asynchronously; wait a tick
      await new Promise(resolve => setTimeout(resolve, 0));
      const storedValue = mockAdapter.store['active-paciente-store'];
      expect(storedValue).toBeDefined();
    });

    it('should persist activePacienteId in the storage adapter', async () => {
      store.getState().setActivePaciente({ id: 'p1', nombre: 'Juan García' });
      await new Promise(resolve => setTimeout(resolve, 0));
      const storedValue = mockAdapter.store['active-paciente-store'];
      const parsed = JSON.parse(storedValue ?? '{}');
      expect(parsed.state?.activePacienteId).toBe('p1');
    });

    it('should persist activePacienteNombre in the storage adapter', async () => {
      store.getState().setActivePaciente({ id: 'p1', nombre: 'Juan García' });
      await new Promise(resolve => setTimeout(resolve, 0));
      const storedValue = mockAdapter.store['active-paciente-store'];
      const parsed = JSON.parse(storedValue ?? '{}');
      expect(parsed.state?.activePacienteNombre).toBe('Juan García');
    });

    it('should NOT persist _hasHydrated (only state fields)', async () => {
      store.getState().setActivePaciente({ id: 'p1', nombre: 'Juan' });
      await new Promise(resolve => setTimeout(resolve, 0));
      const storedValue = mockAdapter.store['active-paciente-store'];
      const parsed = JSON.parse(storedValue ?? '{}');
      expect(parsed.state?._hasHydrated).toBeUndefined();
    });
  });
});
