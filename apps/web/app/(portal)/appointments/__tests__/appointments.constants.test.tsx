import { render, screen } from '@testing-library/react';
import React from 'react';
import { CitaEstadoEnum, type CitaPopulated } from '@repo/types';
import {
  estadoConfig,
  buildAppointmentColumns,
} from '../appointments.constants';

const mockCita = (estado: string): CitaPopulated =>
  ({
    _id: 'cita-1',
    estado: estado as CitaPopulated['estado'],
    fecha: '2026-01-01',
    hora: '10:00',
    createdAt: '',
    updatedAt: '',
    paciente_ID: { _id: 'p1', name: 'Juan', lastName: 'Pérez' },
    medico_ID: {
      _id: 'm1',
      name: 'Dr',
      lastName: 'Smith',
      especialidad: 'General',
    },
    centroSalud_ID: { _id: 'c1', nombre: 'Centro', direccion: 'Calle 1' },
  }) as CitaPopulated;

const noopHandlers = {
  onEdit: vi.fn(),
  onCancel: vi.fn(),
  onAvanzar: vi.fn(),
};

describe('estadoConfig', () => {
  it('has an entry for RESULTADOS_LISTOS with label "Resultados listos" and variant info', () => {
    const entry = estadoConfig[CitaEstadoEnum.RESULTADOS_LISTOS];
    expect(entry).toBeDefined();
    expect(entry.label).toBe('Resultados listos');
    expect(entry.variant).toBe('info');
  });

  it('has an entry for COMPLETADA with label "Completada" and variant success', () => {
    const entry = estadoConfig[CitaEstadoEnum.COMPLETADA];
    expect(entry).toBeDefined();
    expect(entry.label).toBe('Completada');
    expect(entry.variant).toBe('success');
  });
});

describe('buildAppointmentColumns — Avanzar estado button', () => {
  it('renders "Avanzar estado" button for AGENDADA rows', () => {
    const columns = buildAppointmentColumns(noopHandlers);
    const accionesCol = columns.find(c => c.key === 'acciones')!;
    render(
      <div>{accionesCol.render?.(mockCita(CitaEstadoEnum.AGENDADA))}</div>,
    );
    expect(screen.getByText('Avanzar estado')).toBeInTheDocument();
  });

  it('does NOT render "Avanzar estado" button for COMPLETADA rows', () => {
    const columns = buildAppointmentColumns(noopHandlers);
    const accionesCol = columns.find(c => c.key === 'acciones')!;
    render(
      <div>{accionesCol.render?.(mockCita(CitaEstadoEnum.COMPLETADA))}</div>,
    );
    expect(screen.queryByText('Avanzar estado')).not.toBeInTheDocument();
  });

  it('does NOT render "Avanzar estado" button for CANCELADA rows', () => {
    const columns = buildAppointmentColumns(noopHandlers);
    const accionesCol = columns.find(c => c.key === 'acciones')!;
    render(
      <div>{accionesCol.render?.(mockCita(CitaEstadoEnum.CANCELADA))}</div>,
    );
    expect(screen.queryByText('Avanzar estado')).not.toBeInTheDocument();
  });
});
