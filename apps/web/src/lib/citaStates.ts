import type { CitaEstado } from '@repo/types';

export const ACTIVE_CITA_STATES = [
  'agendada',
  'asistida',
  'en_proceso',
  'resultados_listos',
] as const satisfies readonly CitaEstado[];

export const HISTORICAL_CITA_STATES = [
  'completada',
  'cancelada',
] as const satisfies readonly CitaEstado[];

export const isActiveCita = (estado: CitaEstado): boolean =>
  (ACTIVE_CITA_STATES as readonly CitaEstado[]).includes(estado);

export const isHistoricalCita = (estado: CitaEstado): boolean =>
  (HISTORICAL_CITA_STATES as readonly CitaEstado[]).includes(estado);
