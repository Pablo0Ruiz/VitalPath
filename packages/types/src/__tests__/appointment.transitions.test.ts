import { describe, it, expect } from 'vitest';
import { CITA_ALLOWED_TRANSITIONS, CitaEstadoEnum } from '../index';

describe('CITA_ALLOWED_TRANSITIONS', () => {
  it('maps AGENDADA to ASISTIDA', () => {
    expect(CITA_ALLOWED_TRANSITIONS[CitaEstadoEnum.AGENDADA]).toBe(
      CitaEstadoEnum.ASISTIDA,
    );
  });

  it('encodes the full 4-step chain', () => {
    expect(CITA_ALLOWED_TRANSITIONS[CitaEstadoEnum.AGENDADA]).toBe(
      CitaEstadoEnum.ASISTIDA,
    );
    expect(CITA_ALLOWED_TRANSITIONS[CitaEstadoEnum.ASISTIDA]).toBe(
      CitaEstadoEnum.EN_PROCESO,
    );
    expect(CITA_ALLOWED_TRANSITIONS[CitaEstadoEnum.EN_PROCESO]).toBe(
      CitaEstadoEnum.RESULTADOS_LISTOS,
    );
    expect(CITA_ALLOWED_TRANSITIONS[CitaEstadoEnum.RESULTADOS_LISTOS]).toBe(
      CitaEstadoEnum.COMPLETADA,
    );
  });

  it('returns undefined for COMPLETADA (terminal state)', () => {
    expect(CITA_ALLOWED_TRANSITIONS[CitaEstadoEnum.COMPLETADA]).toBeUndefined();
  });

  it('returns undefined for CANCELADA (terminal state)', () => {
    expect(CITA_ALLOWED_TRANSITIONS[CitaEstadoEnum.CANCELADA]).toBeUndefined();
  });

  it('has exactly 4 keys', () => {
    expect(Object.keys(CITA_ALLOWED_TRANSITIONS)).toHaveLength(4);
  });
});
