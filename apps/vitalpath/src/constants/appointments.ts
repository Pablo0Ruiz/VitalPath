import { CitaEstado } from '@repo/types';

export const ESTADO_CONFIG: Record<
  CitaEstado,
  { label: string; bg: string; text: string }
> = {
  agendada: { label: 'Agendada', bg: 'bg-amber-100', text: 'text-amber-700' },
  asistida: { label: 'Asistida', bg: 'bg-blue-100', text: 'text-blue-700' },
  en_proceso: {
    label: 'En Proceso',
    bg: 'bg-indigo-100',
    text: 'text-indigo-700',
  },
  resultados_listos: {
    label: 'Resultados Listos',
    bg: 'bg-purple-100',
    text: 'text-purple-700',
  },
  completada: {
    label: 'Completada',
    bg: 'bg-emerald-100',
    text: 'text-emerald-700',
  },
  cancelada: { label: 'Cancelada', bg: 'bg-red-100', text: 'text-red-400' },
};
