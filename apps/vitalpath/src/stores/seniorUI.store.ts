import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import { UserSession } from '@repo/types';

const secureStorage = {
  getItem: (name: string) => SecureStore.getItemAsync(name),
  setItem: (name: string, value: string) =>
    SecureStore.setItemAsync(name, value),
  removeItem: (name: string) => SecureStore.deleteItemAsync(name),
};

interface SeniorUIState {
  isSeniorUI: boolean;
  hasSeenSuggestion: boolean;
  _hasHydrated: boolean;
  setIsSeniorUI: (v: boolean) => void;
  setHasSeenSuggestion: () => void;
  setHasHydrated: () => void;
  syncWithUser: (user: UserSession | null) => void;
  reset: () => void;
}

export const useSeniorUIStore = create<SeniorUIState>()(
  persist(
    set => ({
      isSeniorUI: false,
      hasSeenSuggestion: false,
      _hasHydrated: false,
      setIsSeniorUI: (v: boolean) => set({ isSeniorUI: v }),
      setHasSeenSuggestion: () => set({ hasSeenSuggestion: true }),
      setHasHydrated: () => set({ _hasHydrated: true }),
      syncWithUser: user => {
        if (user) {
          set({
            isSeniorUI: !!user.seniorMode,
            hasSeenSuggestion: true,
          });
        }
      },
      reset: () =>
        set({
          isSeniorUI: false,
          hasSeenSuggestion: false,
        }),
    }),
    {
      name: 'senior-ui-store',
      storage: createJSONStorage(() => secureStorage),
      partialize: state => ({
        isSeniorUI: state.isSeniorUI,
        hasSeenSuggestion: state.hasSeenSuggestion,
      }),
      onRehydrateStorage: () => state => {
        state?.setHasHydrated();
      },
    },
  ),
);
