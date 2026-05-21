import { render, screen } from '@testing-library/react';
import React from 'react';
import type { Mock } from 'vitest';
import CheckInTable from '../CheckInTable';
import { formatLocalYMD } from '../../../../../utils/format';
import type { CitaPopulated } from '@repo/types';

vi.mock('@repo/api-client', () => ({
  useCitasAdministrator: vi.fn(),
  useAvanzarCitaEstado: vi.fn(),
  useUploadStudy: vi.fn(),
}));

vi.mock('next/font/local', () => ({ default: () => ({ className: '' }) }));

import {
  useCitasAdministrator,
  useAvanzarCitaEstado,
  useUploadStudy,
} from '@repo/api-client';

const TODAY = formatLocalYMD(new Date());
const YESTERDAY = formatLocalYMD(new Date(Date.now() - 86_400_000));

function makeCita(
  overrides: Partial<CitaPopulated> & Pick<CitaPopulated, '_id' | 'estado'>,
): CitaPopulated {
  return {
    fecha: TODAY,
    hora: '09:00',
    createdAt: '',
    updatedAt: '',
    paciente_ID: { _id: 'p1', name: 'Ana', lastName: 'García' },
    medico_ID: {
      _id: 'm1',
      name: 'Dr',
      lastName: 'López',
      especialidad: 'General',
    },
    centroSalud_ID: { _id: 'c1', nombre: 'Centro', direccion: 'Calle 1' },
    ...overrides,
  } as CitaPopulated;
}

function setupMocks() {
  (useAvanzarCitaEstado as unknown as Mock).mockReturnValue({
    mutate: vi.fn(),
  });
  (useUploadStudy as unknown as Mock).mockReturnValue({
    mutate: vi.fn(),
    isPending: false,
  });
}

describe('CheckInTable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupMocks();
  });

  it('renders only today+active appointments', () => {
    (useCitasAdministrator as unknown as Mock).mockReturnValue({
      data: [
        makeCita({ _id: 'a1', estado: 'agendada', fecha: TODAY }),
        makeCita({ _id: 'a2', estado: 'en_proceso', fecha: TODAY }),
        makeCita({ _id: 'a3', estado: 'completada', fecha: TODAY }),
        makeCita({ _id: 'a4', estado: 'agendada', fecha: YESTERDAY }),
      ],
      isLoading: false,
    });
    render(<CheckInTable />);
    // 2 active today rows visible (by patient name which repeats, check by row count approach)
    // Each row shows 'Ana García' but we only have 2 active rows
    const rows = screen.getAllByText('Ana García');
    expect(rows).toHaveLength(2);
  });

  it('excludes appointments from other dates', () => {
    (useCitasAdministrator as unknown as Mock).mockReturnValue({
      data: [
        makeCita({ _id: 'b1', estado: 'agendada', fecha: YESTERDAY }),
        makeCita({ _id: 'b2', estado: 'asistida', fecha: YESTERDAY }),
      ],
      isLoading: false,
    });
    render(<CheckInTable />);
    expect(screen.queryByText('Ana García')).not.toBeInTheDocument();
    expect(screen.getByText('No hay turnos para hoy')).toBeInTheDocument();
  });

  it('excludes completada and cancelada appointments even if today', () => {
    (useCitasAdministrator as unknown as Mock).mockReturnValue({
      data: [
        makeCita({ _id: 'c1', estado: 'completada', fecha: TODAY }),
        makeCita({ _id: 'c2', estado: 'cancelada', fecha: TODAY }),
      ],
      isLoading: false,
    });
    render(<CheckInTable />);
    expect(screen.queryByText('Ana García')).not.toBeInTheDocument();
    expect(screen.getByText('No hay turnos para hoy')).toBeInTheDocument();
  });

  it('shows empty state text when filtered set is empty', () => {
    (useCitasAdministrator as unknown as Mock).mockReturnValue({
      data: [],
      isLoading: false,
    });
    render(<CheckInTable />);
    expect(screen.getByText('No hay turnos para hoy')).toBeInTheDocument();
  });

  it('does NOT show empty state when there is at least one active today appointment', () => {
    (useCitasAdministrator as unknown as Mock).mockReturnValue({
      data: [makeCita({ _id: 'd1', estado: 'agendada', fecha: TODAY })],
      isLoading: false,
    });
    render(<CheckInTable />);
    expect(
      screen.queryByText('No hay turnos para hoy'),
    ).not.toBeInTheDocument();
  });
});
