/**
 * Formatea una fecha nativa a YYYY-MM-DD para fácil indexado.
 * @param date Fecha a formatear.
 * @returns String en formato YYYY-MM-DD.
 */
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

export const isElderlyUser = (
  fechaNacimiento: string | null | undefined,
): boolean => {
  if (!fechaNacimiento) return false;

  let birth: Date;
  const ddmmyyyy = fechaNacimiento.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (ddmmyyyy) {
    const [, day, month, year] = ddmmyyyy.map(Number);
    birth = new Date(year, month - 1, day);
  } else {
    birth = new Date(fechaNacimiento);
  }

  if (isNaN(birth.getTime())) return false;

  const today = new Date();
  const age = today.getFullYear() - birth.getFullYear();
  const hasBirthdayPassed =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() &&
      today.getDate() >= birth.getDate());
  return age - (hasBirthdayPassed ? 0 : 1) >= 65;
};
