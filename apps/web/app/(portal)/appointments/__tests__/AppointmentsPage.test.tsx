import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import type { Mock } from 'vitest';
import type { CitaPopulated } from '@repo/types';

vi.mock('@repo/api-client', () => ({
  useCitasAdministrator: vi.fn(),
  useCitasMedico: vi.fn(),
  useAvanzarCitaEstado: vi.fn(),
  useUploadStudy: vi.fn(),
  useInviteDoctor: vi.fn(),
  useDoctors: vi.fn(),
}));

vi.mock('@repo/store', () => ({
  useAuthStore: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/appointments',
}));

vi.mock('next/font/local', () => ({ default: () => ({ className: '' }) }));

import {
  useCitasAdministrator,
  useCitasMedico,
  useAvanzarCitaEstado,
  useUploadStudy,
} from '@repo/api-client';
import { useAuthStore } from '@repo/store';
import AppointmentsPage from '../page';

function makeCita(id: string, estado: CitaPopulated['estado']): CitaPopulated {
  return {
    _id: id,
    estado,
    fecha: '2026-01-01',
    hora: '10:00',
    createdAt: '',
    updatedAt: '',
    paciente_ID: { _id: 'p1', name: `Paciente${id}`, lastName: 'Test' },
    medico_ID: {
      _id: 'm1',
      name: 'Dr',
      lastName: 'Med',
      especialidad: 'General',
    },
    centroSalud_ID: { _id: 'c1', nombre: 'Centro', direccion: 'Calle 1' },
  } as CitaPopulated;
}

const activaCitas = [
  makeCita('a1', 'agendada'),
  makeCita('a2', 'asistida'),
  makeCita('a3', 'en_proceso'),
  makeCita('a4', 'resultados_listos'),
];

const historicalCitas = [
  makeCita('h1', 'completada'),
  makeCita('h2', 'cancelada'),
];

const allCitas = [...activaCitas, ...historicalCitas];

function setupMocks(citas: CitaPopulated[] = allCitas, role = 'admin') {
  (useCitasAdministrator as unknown as Mock).mockReturnValue({
    data: citas,
    isLoading: false,
  });
  (useCitasMedico as unknown as Mock).mockReturnValue({
    data: [],
    isLoading: false,
  });
  (useAvanzarCitaEstado as unknown as Mock).mockReturnValue({
    mutate: vi.fn(),
  });
  (useUploadStudy as unknown as Mock).mockReturnValue({
    mutate: vi.fn(),
    isPending: false,
  });
  (useAuthStore as unknown as Mock).mockImplementation(
    (sel: (s: unknown) => unknown) => sel({ user: { role } }),
  );
}

describe('AppointmentsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('default tab is Activas (selected)', () => {
    setupMocks();
    render(<AppointmentsPage />);
    const activasTab = screen.getByRole('button', { name: 'Activas' });
    expect(activasTab).toBeInTheDocument();
    // Historial tab also exists but Activas content should be visible
    expect(
      screen.getByRole('button', { name: 'Historial' }),
    ).toBeInTheDocument();
  });

  it('Activas tab renders only active-state citas', () => {
    setupMocks();
    render(<AppointmentsPage />);
    // Active cita patients are visible
    expect(screen.getByText('Pacientea1 Test')).toBeInTheDocument();
    expect(screen.getByText('Pacientea2 Test')).toBeInTheDocument();
    expect(screen.getByText('Pacientea3 Test')).toBeInTheDocument();
    expect(screen.getByText('Pacientea4 Test')).toBeInTheDocument();
    // Historical cita patients are NOT visible
    expect(screen.queryByText('Pacienteh1 Test')).not.toBeInTheDocument();
    expect(screen.queryByText('Pacienteh2 Test')).not.toBeInTheDocument();
  });

  it('clicking Historial tab shows only completada/cancelada citas', async () => {
    setupMocks();
    const user = userEvent.setup();
    render(<AppointmentsPage />);
    await user.click(screen.getByRole('button', { name: 'Historial' }));
    // Historical citas visible
    expect(screen.getByText('Pacienteh1 Test')).toBeInTheDocument();
    expect(screen.getByText('Pacienteh2 Test')).toBeInTheDocument();
    // Active citas NOT visible
    expect(screen.queryByText('Pacientea1 Test')).not.toBeInTheDocument();
  });

  it('shows empty-state when no active citas under Activas tab', () => {
    setupMocks(historicalCitas);
    render(<AppointmentsPage />);
    expect(screen.getByText(/no hay citas activas/i)).toBeInTheDocument();
  });

  it('shows empty-state when no historical citas under Historial tab', async () => {
    setupMocks(activaCitas);
    const user = userEvent.setup();
    render(<AppointmentsPage />);
    await user.click(screen.getByRole('button', { name: 'Historial' }));
    expect(screen.getByText(/no hay historial/i)).toBeInTheDocument();
  });

  it('switching tabs does not reset/reload citas data', async () => {
    setupMocks();
    const user = userEvent.setup();
    render(<AppointmentsPage />);
    // Switch to Historial
    await user.click(screen.getByRole('button', { name: 'Historial' }));
    expect(screen.getByText('Pacienteh1 Test')).toBeInTheDocument();
    // Switch back to Activas — data still present (no re-fetch/reset)
    await user.click(screen.getByRole('button', { name: 'Activas' }));
    expect(screen.getByText('Pacientea1 Test')).toBeInTheDocument();
    expect(screen.queryByText('Pacienteh1 Test')).not.toBeInTheDocument();
  });
});

describe('AppointmentsPage — role branching', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('RB-2: admin role renders "Nueva cita" button (admin view)', () => {
    setupMocks(allCitas, 'admin');
    render(<AppointmentsPage />);
    expect(
      screen.getByRole('button', { name: /nueva cita/i }),
    ).toBeInTheDocument();
  });

  it('RB-2: admin role renders Activas tab', () => {
    setupMocks(allCitas, 'admin');
    render(<AppointmentsPage />);
    expect(screen.getByRole('button', { name: 'Activas' })).toBeInTheDocument();
  });

  it('RB-1: medico role does NOT render "Nueva cita" button', () => {
    setupMocks(allCitas, 'medico');
    render(<AppointmentsPage />);
    expect(
      screen.queryByRole('button', { name: /nueva cita/i }),
    ).not.toBeInTheDocument();
  });

  it('RB-1: medico role does NOT render Activas/Historial tabs', () => {
    setupMocks(allCitas, 'medico');
    render(<AppointmentsPage />);
    expect(
      screen.queryByRole('button', { name: 'Activas' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Historial' }),
    ).not.toBeInTheDocument();
  });
});
