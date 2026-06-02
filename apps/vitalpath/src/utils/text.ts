export const toTitleCase = (name?: string | null): string => {
  if (!name) return '';
  return name.toLowerCase().replace(/\b\p{L}/gu, char => char.toUpperCase());
};
