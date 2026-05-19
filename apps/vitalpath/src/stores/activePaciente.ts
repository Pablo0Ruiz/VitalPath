import { createActivePacienteStore } from '@repo/store';
import { mobileStorageAdapter } from '../adapters/mobileStorageAdapter';

export const useActivePacienteStore =
  createActivePacienteStore(mobileStorageAdapter);
