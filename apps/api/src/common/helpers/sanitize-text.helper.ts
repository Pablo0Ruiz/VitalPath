export const sanitizeMedicalText = (text: string): string => {
  if (!text) return '';

  let sanitized = text;

  sanitized = sanitized.replace(/\bHC[-\s]\d+/gi, '[HISTORIA_CLINICA]');

  sanitized = sanitized.replace(/\b\d{11}\b/g, '[RUC]');

  sanitized = sanitized.replace(
    /\b(\d{8}[A-Z]|[XYZ]\d{7}[A-Z])\b/gi,
    '[NIF_NIE]',
  );

  sanitized = sanitized.replace(
    /\b[ABCDEFGHJNPQRSUVW]\d{7}[0-9A-J]\b/gi,
    '[CIF]',
  );

  sanitized = sanitized.replace(/\b\d{2}[\/\-]\d{2}[\/\-]\d{4}\b/g, '[FECHA]');

  sanitized = sanitized.replace(
    /\b(Av\.|Jr\.|Calle|Psje\.|Mza\.|Paseo|Plaza|Camino|Ronda|Avenida)\s+[^\d\n]+\d+\b/gi,
    '[DIRECCION]',
  );

  sanitized = sanitized.replace(/\b\d{7,8}\b/g, '[DNI]');

  sanitized = sanitized.replace(/\+?\d{9,13}/g, '[TELEFONO]');

  sanitized = sanitized.replace(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    '[EMAIL]',
  );

  return sanitized;
};
