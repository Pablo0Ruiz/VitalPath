import type { CitaPopulated } from '@repo/types';
import type { DashboardAlert } from './types';

export const OVERLOAD_THRESHOLD = 8;

export function formatLocalYMD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function parseLocalDateTime(fecha: string, hora: string): number | null {
  const ms = new Date(`${fecha}T${hora}`).getTime();
  return Number.isNaN(ms) ? null : ms;
}

export function computeDashboardAlerts(
  citas: CitaPopulated[],
  now: Date,
  overloadThreshold: number = OVERLOAD_THRESHOLD,
): DashboardAlert[] {
  const today = formatLocalYMD(now);
  const nowMs = now.getTime();
  const TWENTY_FOUR_H_MS = 24 * 60 * 60 * 1000;

  const noShowAlerts: DashboardAlert[] = [];
  for (const c of citas) {
    if (c.estado !== 'agendada') continue;
    const t = parseLocalDateTime(c.fecha, c.hora);
    if (t === null || t >= nowMs) continue;
    noShowAlerts.push({
      kind: 'no_show',
      severity: 'error',
      label: `${c.paciente_ID.name} ${c.paciente_ID.lastName} — ${c.hora}`,
      count: 1,
      citaId: c._id,
    });
  }

  const staleAlerts: DashboardAlert[] = [];
  for (const c of citas) {
    if (c.estado !== 'resultados_listos') continue;
    const updatedMs = Date.parse(c.updatedAt);
    if (Number.isNaN(updatedMs) || nowMs - updatedMs <= TWENTY_FOUR_H_MS)
      continue;
    const hours = Math.floor((nowMs - updatedMs) / (60 * 60 * 1000));
    staleAlerts.push({
      kind: 'stale_results',
      severity: 'warning',
      label: `${c.paciente_ID.name} ${c.paciente_ID.lastName} — hace ${hours}h`,
      count: 1,
      citaId: c._id,
    });
  }

  const todayByDoctor = new Map<string, { name: string; count: number }>();
  for (const c of citas) {
    if (c.fecha !== today) continue;
    const m = c.medico_ID;
    if (!m?._id) continue;
    const prev = todayByDoctor.get(m._id);
    if (prev) {
      prev.count += 1;
    } else {
      todayByDoctor.set(m._id, { name: `${m.name} ${m.lastName}`, count: 1 });
    }
  }
  const overloadAlerts: DashboardAlert[] = [];
  for (const [medicoId, { name, count }] of todayByDoctor) {
    if (count > overloadThreshold) {
      overloadAlerts.push({
        kind: 'doctor_overload',
        severity: 'warning',
        label: `${name} — ${count} turnos hoy`,
        count,
        medicoId,
      });
    }
  }
  overloadAlerts.sort((a, b) => b.count - a.count);

  return [...noShowAlerts, ...staleAlerts, ...overloadAlerts];
}
