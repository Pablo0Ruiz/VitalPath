import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import type { UserSession } from '@repo/types';

const secureStorage = {
  getItem: (name: string) => SecureStore.getItemAsync(name),
  setItem: (name: string, value: string) =>
    SecureStore.setItemAsync(name, value),
  removeItem: (name: string) => SecureStore.deleteItemAsync(name),
};

interface AuthState {
  user: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  _hasHydrated: boolean;
  setSession: (user: UserSession) => void;
  clearSession: () => void;
  setIsLoading: (value: boolean) => void;
  setHasHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
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
      storage: createJSONStorage(() => secureStorage),
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
