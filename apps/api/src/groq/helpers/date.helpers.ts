export const nextMonday = (from: Date = new Date()): Date => {
  const referenceDate =
    from instanceof Date && !isNaN(from.getTime()) ? from : new Date();
  const d = referenceDate.getUTCDay();
  const daysUntilMonday = (1 - d + 7) % 7 || 7;
  return new Date(
    Date.UTC(
      referenceDate.getUTCFullYear(),
      referenceDate.getUTCMonth(),
      referenceDate.getUTCDate() + daysUntilMonday,
      0,
      0,
      0,
      0,
    ),
  );
};
