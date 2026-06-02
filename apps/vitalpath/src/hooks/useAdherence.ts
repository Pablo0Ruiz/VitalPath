import { useMemo } from 'react';
import { useMedicaments } from '@repo/api-client';

export interface AdherenceData {
  adherenceValue: string | null;
  pendingMedsCount: number | null;
}

export function useAdherence(): AdherenceData {
  const { data: medicaments } = useMedicaments();

  const adherenceValue = useMemo<string | null>(() => {
    if (!medicaments || medicaments.length === 0) return null;
    const taken = medicaments.filter(m => m.dosesTaken > 0).length;
    const total = medicaments.length;
    return `${Math.round((taken / total) * 100)}%`;
  }, [medicaments]);

  const pendingMedsCount = useMemo<number | null>(() => {
    if (!medicaments || medicaments.length === 0) return null;
    return medicaments.filter(m => m.dosesTaken === 0).length;
  }, [medicaments]);

  return { adherenceValue, pendingMedsCount };
}
