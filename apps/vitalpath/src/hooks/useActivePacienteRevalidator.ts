import { useEffect } from 'react';
import { useMisPacientes } from '@repo/api-client';
import { useActivePacienteStore } from '@/src/stores/activePaciente';
import { useAuthStore } from '@/src/stores/auth';

export function useActivePacienteRevalidator(): void {
  const user = useAuthStore(s => s.user);
  const activePacienteId = useActivePacienteStore(s => s.activePacienteId);
  const clearActivePaciente = useActivePacienteStore(
    s => s.clearActivePaciente,
  );

  const { data: pacientes = [], isSuccess } = useMisPacientes();

  useEffect(() => {
    if (user?.role !== 'CUIDADOR_FAMILIAR') return;
    if (!activePacienteId) return;
    if (!isSuccess) return;

    const isStillActive = pacientes.some(
      p =>
        p.paciente_id._id === activePacienteId && p.estado_vinculo === 'ACTIVO',
    );

    if (!isStillActive) {
      clearActivePaciente();
    }
  }, [activePacienteId, clearActivePaciente, isSuccess, pacientes, user?.role]);
}
