import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useActivePacienteStore } from '@/src/stores/activePaciente';
import { appointmentKeys, resumeKeys } from '@repo/api-client';

export function useSetActivePaciente(): (payload: {
  id: string;
  nombre: string;
}) => void {
  const queryClient = useQueryClient();
  const setActivePaciente = useActivePacienteStore(s => s.setActivePaciente);

  return useCallback(
    (payload: { id: string; nombre: string }) => {
      setActivePaciente(payload);
      queryClient.removeQueries({ queryKey: appointmentKeys.all });
      queryClient.removeQueries({ queryKey: resumeKeys.all });
    },
    [setActivePaciente, queryClient],
  );
}
