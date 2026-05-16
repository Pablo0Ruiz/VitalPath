export const nextMonday = (from: Date = new Date()): Date => {
  const d = from.getUTCDay();
  const daysUntilMonday = (1 - d + 7) % 7 || 7;
  return new Date(
    Date.UTC(
      from.getUTCFullYear(),
      from.getUTCMonth(),
      from.getUTCDate() + daysUntilMonday,
      0,
      0,
      0,
      0,
    ),
  );
};
