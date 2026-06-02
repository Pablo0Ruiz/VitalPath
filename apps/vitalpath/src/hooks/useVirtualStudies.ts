import { useMemo } from 'react';
import { useMedicalResultsPaciente, useCitas } from '@repo/api-client';
import type { IMedicalResults } from '@repo/types';
import { useAuthStore } from '@/src/stores/auth';

export interface VirtualStudiesData {
  data: IMedicalResults[];
  isInitialLoading: boolean;
  isRefreshing: boolean;
  refetch: () => void;
  refetchCitas: () => void;
}

export function useVirtualStudies(): VirtualStudiesData {
  const { user } = useAuthStore();

  const {
    data: resultados,
    isLoading: isLoadResults,
    refetch,
    isFetching: isFetchingResults,
  } = useMedicalResultsPaciente();

  const {
    data: citas = [],
    isLoading: isLoadCitas,
    refetch: refetchCitas,
    isFetching: isFetchingCitas,
  } = useCitas(user?._id ?? '');

  const data = useMemo<IMedicalResults[]>(() => {
    const list: IMedicalResults[] = [...(resultados || [])];

    const ongoingStates = ['asistida', 'en_proceso'];
    const ongoingCitas = citas.filter(
      c =>
        ongoingStates.includes(c.estado) &&
        !list.some(r => r.cita_ID?._id === c._id),
    );

    const virtualResults = ongoingCitas.map(c => ({
      _id: c._id,
      cita_ID: {
        _id: c._id,
        fecha: c.fecha,
        hora: c.hora,
        estado: c.estado,
      },
      medico_ID: c.medico_ID,
      paciente_ID: c.paciente_ID,
      fileUrl: '',
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    })) as IMedicalResults[];

    return [...virtualResults, ...list].sort((a, b) => {
      const dateA = a.cita_ID?.fecha || a.createdAt;
      const dateB = b.cita_ID?.fecha || b.createdAt;
      return dateB.localeCompare(dateA);
    });
  }, [resultados, citas]);

  const isInitialLoading =
    (isLoadResults && !resultados) || (isLoadCitas && citas.length === 0);

  const isRefreshing = isFetchingResults || isFetchingCitas;

  return { data, isInitialLoading, isRefreshing, refetch, refetchCitas };
}
