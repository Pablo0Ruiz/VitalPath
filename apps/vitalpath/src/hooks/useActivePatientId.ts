import { useAuthStore } from '@/src/stores/auth';
import { useActivePacienteStore } from '@/src/stores/activePaciente';

export interface ActivePatientIdResult {
  patientId: string | null;
  isCuidador: boolean;
  needsSelection: boolean;
}

export function useActivePatientId(): ActivePatientIdResult {
  const user = useAuthStore(s => s.user);
  const activePacienteId = useActivePacienteStore(s => s.activePacienteId);

  const isCuidador = user?.role === 'CUIDADOR_FAMILIAR';

  if (isCuidador) {
    return {
      patientId: activePacienteId,
      isCuidador: true,
      needsSelection: !activePacienteId,
    };
  }

  return {
    patientId: user?._id ?? null,
    isCuidador: false,
    needsSelection: false,
  };
}
