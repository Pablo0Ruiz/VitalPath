export const sanitizeMedicalText = (text: string): string => {
  if (!text) return '';

  let sanitized = text;

  sanitized = sanitized.replace(/\b\d{7,8}\b/g, '[DNI_ANONIMIZADO]');

  sanitized = sanitized.replace(/\+?\d{9,13}/g, '[TELEFONO_ANONIMIZADO]');

  sanitized = sanitized.replace(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    '[EMAIL_ANONIMIZADO]',
  );

  return sanitized;
};
