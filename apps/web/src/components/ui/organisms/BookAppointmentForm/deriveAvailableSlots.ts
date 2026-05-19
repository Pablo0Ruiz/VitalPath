import type { CitaPopulated } from '@repo/types';

export function deriveAvailableSlots(
  citas: CitaPopulated[] | undefined,
  medicoId: string | undefined,
  fecha: string | undefined,
  doctorSlots: string[] | undefined,
  excludeCitaId?: string,
): string[] {
  if (!medicoId || !fecha || !doctorSlots?.length) return [];
  const taken = new Set(
    (citas ?? [])
      .filter(
        c =>
          c._id !== excludeCitaId &&
          c.medico_ID?._id === medicoId &&
          c.fecha === fecha,
      )
      .map(c => c.hora),
  );
  return doctorSlots.filter(slot => !taken.has(slot));
}
