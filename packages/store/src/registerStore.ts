import { create } from 'zustand';
import { RegisterDraft } from '@repo/types';

interface RegisterStore {
  draft: Partial<RegisterDraft>;
  setStep1: (data: Pick<RegisterDraft, 'name' | 'lastName'>) => void;
  setStep2: (data: Pick<RegisterDraft, 'fechaNacimiento' | 'genero'>) => void;
  setStep3: (data: Pick<RegisterDraft, 'email' | 'password'>) => void;
  getAll: () => RegisterDraft | null;
  reset: () => void;
}

export const useRegisterStore = create<RegisterStore>((set, get) => ({
  draft: {},

  setStep1: data =>
    set((s: RegisterStore) => ({ draft: { ...s.draft, ...data } })),

  setStep2: data =>
    set((s: RegisterStore) => ({ draft: { ...s.draft, ...data } })),

  setStep3: data =>
    set((s: RegisterStore) => ({ draft: { ...s.draft, ...data } })),

  getAll: () => {
    const d = get().draft;
    if (
      d.name &&
      d.lastName &&
      d.email &&
      d.password &&
      d.fechaNacimiento &&
      d.genero
    ) {
      return d as RegisterDraft;
    }
    return null;
  },

  reset: () => set({ draft: {} }),
}));
