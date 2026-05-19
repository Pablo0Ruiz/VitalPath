import { useMemo } from 'react';
import type { CitaPopulated } from '@repo/types';

export function usePatientOptions(citas: CitaPopulated[] | undefined) {
  return useMemo(() => {
    if (!citas) return [];
    const seen = new Map<string, { value: string; label: string }>();
    for (const c of citas) {
      const p = c.paciente_ID;
      if (!p?._id || seen.has(p._id)) continue;
      seen.set(p._id, {
        value: p._id,
        label: `${p.name} ${p.lastName ?? ''}`.trim(),
      });
    }
    return Array.from(seen.values());
  }, [citas]);
}
