import { create } from 'zustand';
import type { UserSession } from '@repo/types';

interface AuthState {
  user: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setSession: (user: UserSession) => void;
  clearSession: () => void;
  setIsLoading: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(set => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setSession: user => set({ user, isAuthenticated: true }),
  clearSession: () => set({ user: null, isAuthenticated: false }),
  setIsLoading: isLoading => set({ isLoading }),
}));
