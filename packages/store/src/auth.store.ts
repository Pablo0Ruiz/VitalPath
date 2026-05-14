import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UserSession } from '@repo/types';
import type { StorageAdapter } from './storage.adapter';

export interface AuthState {
  user: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  _hasHydrated: boolean;
  setSession: (user: UserSession) => void;
  clearSession: () => void;
  setIsLoading: (value: boolean) => void;
  setHasHydrated: () => void;
}

export const createAuthStore = (storage: StorageAdapter) =>
  create<AuthState>()(
    persist(
      set => ({
        user: null,
        isAuthenticated: false,
        isLoading: true,
        _hasHydrated: false,
        setSession: user => set({ user, isAuthenticated: true }),
        clearSession: () => set({ user: null, isAuthenticated: false }),
        setIsLoading: isLoading => set({ isLoading }),
        setHasHydrated: () => set({ _hasHydrated: true }),
      }),
      {
        name: 'auth-store',
        storage: createJSONStorage(() => ({
          getItem: storage.getItem.bind(storage),
          setItem: storage.setItem.bind(storage),
          removeItem: storage.removeItem.bind(storage),
        })),
        partialize: state => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          // isLoading y _hasHydrated NO se persisten
        }),
        onRehydrateStorage: () => state => {
          state?.setHasHydrated();
        },
      },
    ),
  );

export type UseAuthStore = ReturnType<typeof createAuthStore>;
