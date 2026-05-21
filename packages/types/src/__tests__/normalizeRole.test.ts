import { describe, it, expect } from 'vitest';
import { normalizeRole } from '../index';

describe('normalizeRole', () => {
  it('lowercases a known uppercase role: MEDICO -> medico', () => {
    expect(normalizeRole('MEDICO')).toBe('medico');
  });

  it('passes through a known lowercase role: medico -> medico', () => {
    expect(normalizeRole('medico')).toBe('medico');
  });

  it('normalizes uppercase CUIDADOR_FAMILIAR to cuidador_familiar', () => {
    expect(normalizeRole('CUIDADOR_FAMILIAR')).toBe('cuidador_familiar');
  });

  it('passes through lowercase cuidador_familiar unchanged', () => {
    expect(normalizeRole('cuidador_familiar')).toBe('cuidador_familiar');
  });

  it('returns null for an unknown role string', () => {
    expect(normalizeRole('unknown_role')).toBeNull();
  });

  it('returns null for undefined input', () => {
    expect(normalizeRole(undefined)).toBeNull();
  });

  it('returns null for an empty string', () => {
    expect(normalizeRole('')).toBeNull();
  });

  // Triangulation: additional canonical roles
  it('normalizes PACIENTE to paciente', () => {
    expect(normalizeRole('PACIENTE')).toBe('paciente');
  });

  it('normalizes TRABAJADOR_CENTRO to trabajador_centro', () => {
    expect(normalizeRole('TRABAJADOR_CENTRO')).toBe('trabajador_centro');
  });

  it('normalizes ADMIN to admin', () => {
    expect(normalizeRole('ADMIN')).toBe('admin');
  });
});
