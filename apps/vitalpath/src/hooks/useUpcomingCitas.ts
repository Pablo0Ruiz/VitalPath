import { useMemo } from 'react';
import { useCitas } from '@repo/api-client';
import type { CitaPopulated } from '@repo/types';
import { parseLocalDateTime, formatDateHuman } from '@/src/utils/date';

export interface UpcomingCitasData {
  upcomingCitas: CitaPopulated[];
  nextCitaValue: string | null;
  isLoading: boolean;
}

export function useUpcomingCitas(patientId: string): UpcomingCitasData {
  const { data: citas = [], isLoading } = useCitas(patientId) as {
    data: CitaPopulated[];
    isLoading: boolean;
  };

  const upcomingCitas = useMemo<CitaPopulated[]>(() => {
    const now = new Date();
    return [...citas]
      .filter(
        c =>
          c.estado === 'agendada' && parseLocalDateTime(c.fecha, c.hora) > now,
      )
      .sort((a, b) => {
        const dateCompare = a.fecha.localeCompare(b.fecha);
        if (dateCompare !== 0) return dateCompare;
        return a.hora.localeCompare(b.hora);
      });
  }, [citas]);

  const nextCitaValue = useMemo<string | null>(() => {
    if (upcomingCitas.length === 0) return null;
    return formatDateHuman(upcomingCitas[0].fecha);
  }, [upcomingCitas]);

  return { upcomingCitas, nextCitaValue, isLoading };
}
