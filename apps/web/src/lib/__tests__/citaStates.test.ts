import { describe, it, expect } from 'vitest';
import {
  ACTIVE_CITA_STATES,
  HISTORICAL_CITA_STATES,
  isActiveCita,
  isHistoricalCita,
} from '../citaStates';
import type { CitaEstado } from '@repo/types';

describe('citaStates', () => {
  describe('ACTIVE_CITA_STATES tuple', () => {
    it('contains the four active estados', () => {
      const expected: CitaEstado[] = [
        'agendada',
        'asistida',
        'en_proceso',
        'resultados_listos',
      ];
      expect([...ACTIVE_CITA_STATES]).toEqual(expect.arrayContaining(expected));
      expect(ACTIVE_CITA_STATES).toHaveLength(4);
    });

    it('does NOT contain completada or cancelada', () => {
      expect(ACTIVE_CITA_STATES).not.toContain('completada');
      expect(ACTIVE_CITA_STATES).not.toContain('cancelada');
    });
  });

  describe('HISTORICAL_CITA_STATES tuple', () => {
    it('contains completada and cancelada', () => {
      expect(HISTORICAL_CITA_STATES).toContain('completada');
      expect(HISTORICAL_CITA_STATES).toContain('cancelada');
      expect(HISTORICAL_CITA_STATES).toHaveLength(2);
    });

    it('does NOT contain any active estado', () => {
      const activeEstados: CitaEstado[] = [
        'agendada',
        'asistida',
        'en_proceso',
        'resultados_listos',
      ];
      for (const e of activeEstados) {
        expect(HISTORICAL_CITA_STATES).not.toContain(e);
      }
    });
  });

  describe('isActiveCita', () => {
    it('returns true for all four active estados', () => {
      expect(isActiveCita('agendada')).toBe(true);
      expect(isActiveCita('asistida')).toBe(true);
      expect(isActiveCita('en_proceso')).toBe(true);
      expect(isActiveCita('resultados_listos')).toBe(true);
    });

    it('returns false for completada', () => {
      expect(isActiveCita('completada')).toBe(false);
    });

    it('returns false for cancelada', () => {
      expect(isActiveCita('cancelada')).toBe(false);
    });
  });

  describe('isHistoricalCita', () => {
    it('returns true for completada and cancelada', () => {
      expect(isHistoricalCita('completada')).toBe(true);
      expect(isHistoricalCita('cancelada')).toBe(true);
    });

    it('returns false for all four active estados', () => {
      expect(isHistoricalCita('agendada')).toBe(false);
      expect(isHistoricalCita('asistida')).toBe(false);
      expect(isHistoricalCita('en_proceso')).toBe(false);
      expect(isHistoricalCita('resultados_listos')).toBe(false);
    });

    it('is the inverse of isActiveCita for all CitaEstado values', () => {
      const allEstados: CitaEstado[] = [
        'agendada',
        'asistida',
        'en_proceso',
        'resultados_listos',
        'completada',
        'cancelada',
      ];
      for (const e of allEstados) {
        expect(isActiveCita(e)).toBe(!isHistoricalCita(e));
      }
    });
  });
});
