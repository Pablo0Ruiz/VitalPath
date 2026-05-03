import { ThemeTokens } from './tokens';

export const getEstadoConfig = (t: ThemeTokens) => ({
  agendada: { label: 'Agendada', bg: t.warningLight, text: t.warningDark },
  asistida: { label: 'Asistida', bg: t.infoLight, text: t.infoDark },
  en_proceso: {
    label: 'En Proceso',
    bg: t.primary100,
    text: t.primary700,
  },
  resultados_listos: {
    label: 'Resultados Listos',
    bg: t.secondary100,
    text: t.secondary700,
  },
  completada: {
    label: 'Completada',
    bg: t.successLight,
    text: t.successDark,
  },
  cancelada: { label: 'Cancelada', bg: t.errorLight, text: t.errorDark },
});
