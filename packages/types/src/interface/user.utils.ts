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
