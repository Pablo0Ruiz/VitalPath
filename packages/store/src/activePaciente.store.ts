import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { StorageAdapter } from './storage.adapter';

export interface ActivePacienteState {
  activePacienteId: string | null;
  activePacienteNombre: string | null;
  _hasHydrated: boolean;
  setActivePaciente: (payload: { id: string; nombre: string }) => void;
  clearActivePaciente: () => void;
  setHasHydrated: () => void;
}

export const createActivePacienteStore = (storage: StorageAdapter) =>
  create<ActivePacienteState>()(
    persist(
      set => ({
        activePacienteId: null,
        activePacienteNombre: null,
        _hasHydrated: false,
        setActivePaciente: ({ id, nombre }) =>
          set({ activePacienteId: id, activePacienteNombre: nombre }),
        clearActivePaciente: () =>
          set({ activePacienteId: null, activePacienteNombre: null }),
        setHasHydrated: () => set({ _hasHydrated: true }),
      }),
      {
        name: 'active-paciente-store',
        storage: createJSONStorage(() => ({
          getItem: storage.getItem.bind(storage),
          setItem: storage.setItem.bind(storage),
          removeItem: storage.removeItem.bind(storage),
        })),
        partialize: state => ({
          activePacienteId: state.activePacienteId,
          activePacienteNombre: state.activePacienteNombre,
        }),
        onRehydrateStorage: () => state => {
          state?.setHasHydrated();
        },
      },
    ),
  );

export type UseActivePacienteStore = ReturnType<
  typeof createActivePacienteStore
>;
