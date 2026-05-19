import { useMutation } from '@tanstack/react-query';
import { postRegisterPatientByWorker } from '../actions/auth.actions';
import type {
  RegisterPatientByWorkerPayload,
  CreatedPatientResponse,
} from '../actions/auth.actions';

interface RegisterPatientByWorkerCallbacks {
  onSuccess?: (patient: CreatedPatientResponse) => void;
  onError?: (error: unknown) => void;
}

export const useRegisterPatientByWorker = (
  callbacks?: RegisterPatientByWorkerCallbacks,
) => {
  return useMutation({
    mutationFn: (payload: RegisterPatientByWorkerPayload) =>
      postRegisterPatientByWorker(payload),
    onSuccess: data => {
      callbacks?.onSuccess?.(data);
    },
    onError: (error: unknown) => {
      console.error('[useRegisterPatientByWorker] Error:', error);
      callbacks?.onError?.(error);
    },
  });
};
