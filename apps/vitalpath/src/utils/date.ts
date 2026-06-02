const MONTHS_ES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

export const formatDateHuman = (dateString: string): string => {
  const [year, month, day] = dateString.split('-').map(Number);
  return `${day} de ${MONTHS_ES[month - 1]} de ${year}`;
};

export const formatRelativeDay = (dateString: string): string => {
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowKey = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;

  if (dateString === todayKey) return 'Hoy';
  if (dateString === tomorrowKey) return 'Mañana';
  if (dateString === yesterdayKey) return 'Ayer';
  return formatDateHuman(dateString);
};

export const extractDateKey = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

export const formatTime = (isoString: string): string => {
  return new Date(isoString).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDate = (dateString: string): string => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString();
};

export const formatDateShort = (dateString: string): string => {
  const [, month, day] = dateString.split('-');
  return `${day}/${month}`;
};

export const parseLocalDateTime = (fecha: string, hora: string): Date => {
  const [year, month, day] = fecha.split('-').map(Number);
  const [hours, minutes] = hora.split(':').map(Number);
  return new Date(year, month - 1, day, hours, minutes);
};

// isElderlyUser has been moved to @repo/types — re-exported here for backwards compatibility.
export { isElderlyUser } from '@repo/types';
