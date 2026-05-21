import { render, screen } from '@testing-library/react';
import React from 'react';
import type { Mock } from 'vitest';
import type { CitaPopulated } from '@repo/types';

vi.mock('@repo/api-client', () => ({
  useCitasMedico: vi.fn(),
}));

vi.mock('next/font/local', () => ({ default: () => ({ className: '' }) }));

// Pin today to a known date so filter tests are deterministic
const FIXED_TODAY = '2026-05-21';
vi.mock('@/utils/format', () => ({
  formatLocalYMD: vi.fn(() => FIXED_TODAY),
}));

import { useCitasMedico } from '@repo/api-client';
import MedicoAppointmentsView from '../MedicoAppointmentsView';

function makeCita(id: string, fecha: string): CitaPopulated {
  return {
    _id: id,
    estado: 'agendada',
    fecha,
    hora: '09:30',
    createdAt: '',
    updatedAt: '',
    paciente_ID: {
      _id: 'p1',
      name: 'Ana',
      lastName: 'García',
    } as CitaPopulated['paciente_ID'],
    medico_ID: {
      _id: 'm1',
      name: 'Dr',
      lastName: 'Med',
      especialidad: 'General',
    } as CitaPopulated['medico_ID'],
    centroSalud_ID: {
      _id: 'c1',
      nombre: 'Centro',
      direccion: 'Calle 1',
    } as CitaPopulated['centroSalud_ID'],
  } as CitaPopulated;
}

describe('MedicoAppointmentsView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Scenario MV-1: date filter — past citas excluded, today and future included
  it('shows upcoming citas and hides past ones', () => {
    const futureCita = makeCita('c-future', '2026-06-01');
    const todayCita = makeCita('c-today', '2026-05-21');
    const pastCita = makeCita('c-past', '2026-05-20');

    (useCitasMedico as unknown as Mock).mockReturnValue({
      data: [futureCita, todayCita, pastCita],
      isLoading: false,
    });

    render(<MedicoAppointmentsView />);

    // Future and today citas are visible (by fecha value in the cell)
    expect(screen.getByText('2026-06-01')).toBeInTheDocument();
    expect(screen.getByText('2026-05-21')).toBeInTheDocument();
    // Past cita is NOT visible
    expect(screen.queryByText('2026-05-20')).not.toBeInTheDocument();
  });

  // Scenario MV-3: loading state passes through to DataTable
  it('shows loading state and no empty-state message while loading', () => {
    (useCitasMedico as unknown as Mock).mockReturnValue({
      data: [],
      isLoading: true,
    });

    render(<MedicoAppointmentsView />);

    // Loading indicator must be present (DataTable renders loading skeleton or spinner)
    // We test by checking empty-state message is absent when loading
    expect(
      screen.queryByText(/no hay citas próximas/i),
    ).not.toBeInTheDocument();
  });

  // Scenario MV-4: read-only — no action buttons
  it('renders no edit, cancel, or avanzar buttons', () => {
    const cita = makeCita('c1', '2026-06-01');
    (useCitasMedico as unknown as Mock).mockReturnValue({
      data: [cita],
      isLoading: false,
    });

    render(<MedicoAppointmentsView />);

    expect(
      screen.queryByRole('button', { name: /editar/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /cancelar/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /avanzar/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /nueva cita/i }),
    ).not.toBeInTheDocument();
  });

  // Scenario MV-2: empty state when no upcoming citas
  it('shows empty-state message when filtered list is empty and not loading', () => {
    const pastCita = makeCita('c-past', '2026-05-20');
    (useCitasMedico as unknown as Mock).mockReturnValue({
      data: [pastCita],
      isLoading: false,
    });

    render(<MedicoAppointmentsView />);

    expect(screen.getByText(/no hay citas próximas/i)).toBeInTheDocument();
  });
});
