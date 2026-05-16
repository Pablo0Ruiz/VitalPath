import { sanitizeMedicalText } from './sanitize-text.helper';

describe('sanitizeMedicalText', () => {
  describe('empty / falsy input', () => {
    it('returns empty string for empty input', () => {
      expect(sanitizeMedicalText('')).toBe('');
    });
  });

  describe('Pattern 1 — Historia Clínica', () => {
    it('replaces HC-XXXXXXX with [HISTORIA_CLINICA]', () => {
      const result = sanitizeMedicalText('Paciente HC-00123 en consulta');
      expect(result).toContain('[HISTORIA_CLINICA]');
      expect(result).not.toContain('HC-00123');
    });

    it('replaces HC XXXXXXX (space separator) with [HISTORIA_CLINICA]', () => {
      const result = sanitizeMedicalText('Número HC 00123 registrado');
      expect(result).toContain('[HISTORIA_CLINICA]');
      expect(result).not.toContain('HC 00123');
    });
  });

  describe('Pattern 2 — RUC (11 dígitos)', () => {
    it('replaces 11-digit RUC with [RUC]', () => {
      const result = sanitizeMedicalText('RUC empresa: 10345678901');
      expect(result).toContain('[RUC]');
      expect(result).not.toContain('10345678901');
    });

    it('does NOT produce [DNI] for an 11-digit sequence', () => {
      const result = sanitizeMedicalText('10345678901');
      expect(result).toBe('[RUC]');
      expect(result).not.toContain('[DNI]');
    });
  });

  describe('Pattern 3 — Fecha de nacimiento', () => {
    it('replaces dd/mm/yyyy format with [FECHA]', () => {
      const result = sanitizeMedicalText('Nacido el 12/05/1980');
      expect(result).toContain('[FECHA]');
      expect(result).not.toContain('12/05/1980');
    });

    it('replaces dd-mm-yyyy format with [FECHA]', () => {
      const result = sanitizeMedicalText('Fecha: 12-05-1980');
      expect(result).toContain('[FECHA]');
      expect(result).not.toContain('12-05-1980');
    });
  });

  describe('Pattern 4 — Dirección', () => {
    it('replaces address with Av. prefix with [DIRECCION]', () => {
      const result = sanitizeMedicalText('Vive en Av. Los Pinos 432');
      expect(result).toContain('[DIRECCION]');
      expect(result).not.toContain('Av. Los Pinos 432');
    });

    it('replaces address with Calle prefix with [DIRECCION]', () => {
      const result = sanitizeMedicalText('Dirección: Calle Real 10');
      expect(result).toContain('[DIRECCION]');
      expect(result).not.toContain('Calle Real 10');
    });

    it('replaces address with Paseo prefix with [DIRECCION]', () => {
      const result = sanitizeMedicalText('Vive en Paseo de la Castellana 50');
      expect(result).toContain('[DIRECCION]');
      expect(result).not.toContain('Paseo de la Castellana 50');
    });
  });

  describe('Pattern 5 — DNI (7-8 dígitos)', () => {
    it('replaces 8-digit DNI with [DNI]', () => {
      const result = sanitizeMedicalText('DNI: 12345678');
      expect(result).toContain('[DNI]');
      expect(result).not.toContain('12345678');
    });

    it('replaces 7-digit DNI with [DNI]', () => {
      const result = sanitizeMedicalText('DNI: 1234567');
      expect(result).toContain('[DNI]');
      expect(result).not.toContain('1234567');
    });
  });

  describe('Pattern 6 — Teléfono (9-13 dígitos)', () => {
    it('replaces 9-digit phone number with [TELEFONO]', () => {
      const result = sanitizeMedicalText('Llama al 987654321');
      expect(result).toContain('[TELEFONO]');
      expect(result).not.toContain('987654321');
    });

    it('replaces phone with + prefix with [TELEFONO]', () => {
      // Use 9 digits after + so it doesn't match the 11-digit RUC pattern first
      const result = sanitizeMedicalText('Contacto: +987654321');
      expect(result).toContain('[TELEFONO]');
      expect(result).not.toContain('+987654321');
    });
  });

  describe('Pattern 7 — Email', () => {
    it('replaces email address with [EMAIL]', () => {
      const result = sanitizeMedicalText('Correo: paciente@example.com');
      expect(result).toContain('[EMAIL]');
      expect(result).not.toContain('paciente@example.com');
    });
  });

  describe('Pattern 8 — NIF/NIE (España)', () => {
    it('replaces NIF with [NIF_NIE]', () => {
      const result = sanitizeMedicalText('NIF: 12345678Z');
      expect(result).toContain('[NIF_NIE]');
      expect(result).not.toContain('12345678Z');
    });

    it('replaces NIE with [NIF_NIE]', () => {
      const result = sanitizeMedicalText('NIE: X1234567Z');
      expect(result).toContain('[NIF_NIE]');
      expect(result).not.toContain('X1234567Z');
    });
  });

  describe('Pattern 9 — CIF (España)', () => {
    it('replaces CIF with [CIF]', () => {
      const result = sanitizeMedicalText('CIF: A1234567B');
      expect(result).toContain('[CIF]');
      expect(result).not.toContain('A1234567B');
    });
  });

  describe('Composite — all PII types in a single string', () => {
    it('replaces all PII patterns in one pass', () => {
      const input = [
        'HC-00123',
        '10345678901',
        '12/05/1980',
        'Av. Los Pinos 432',
        '12345678',
        '987654321',
        'test@correo.pe',
      ].join(' ');

      const result = sanitizeMedicalText(input);

      expect(result).toContain('[HISTORIA_CLINICA]');
      expect(result).toContain('[RUC]');
      expect(result).toContain('[FECHA]');
      expect(result).toContain('[DIRECCION]');
      expect(result).toContain('[DNI]');
      expect(result).toContain('[TELEFONO]');
      expect(result).toContain('[EMAIL]');

      expect(result).not.toContain('HC-00123');
      expect(result).not.toContain('10345678901');
      expect(result).not.toContain('12/05/1980');
      expect(result).not.toContain('Av. Los Pinos 432');
      expect(result).not.toContain('12345678');
      expect(result).not.toContain('987654321');
      expect(result).not.toContain('test@correo.pe');
    });
  });

  describe('Known limitation — plain names are NOT redacted', () => {
    it('leaves a plain person name unchanged', () => {
      const result = sanitizeMedicalText('Paciente: Juan Pérez García');
      expect(result).toBe('Paciente: Juan Pérez García');
    });
  });
});
