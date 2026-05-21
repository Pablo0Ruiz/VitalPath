import { render, screen } from '@testing-library/react';
import React from 'react';
import type { Mock } from 'vitest';
import type { CitaPopulated } from '@repo/types';
import type { DoctorSession } from '@repo/api-client';

vi.mock('@repo/api-client', () => ({
  useDoctors: vi.fn(),
  useCitasAdministrator: vi.fn(),
}));

vi.mock('@repo/store', () => ({
  useAuthStore: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useParams: vi.fn(),
}));

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

vi.mock('next/font/local', () => ({ default: () => ({ className: '' }) }));

import { useDoctors, useCitasAdministrator } from '@repo/api-client';
import { useAuthStore } from '@repo/store';
import { useParams } from 'next/navigation';
import DoctorDetailPage from '../page';

const TODAY = '2026-05-20';
vi.mock('@/utils/format', () => ({
  formatLocalYMD: () => TODAY,
}));

function makeDoctor(id: string): DoctorSession {
  return {
    _id: id,
    especialidad: 'Cardiología',
    slots: ['09:00', '10:00'],
    citas: [],
    user: {
      _id: `u-${id}`,
      name: 'Ana',
      lastName: 'García',
      email: 'ana@test.com',
      role: 'medico',
      isActive: true,
      genero: 'F',
      centroSalud_ID: {
        _id: 'c1',
        nombre: 'Centro Norte',
        direccion: 'Av 1',
        tipo: 'hospital',
        listaMedicos_ID: [],
        listaTrabajadores_ID: [],
        codigoVinculacion: '',
        createdAt: '',
        updatedAt: '',
        __v: 0,
      },
      fechaNacimiento: '1980-01-01',
    },
  };
}

function makeCita(
  id: string,
  medicoUserId: string,
  fecha: string,
  estado = 'agendada',
): CitaPopulated {
  return {
    _id: id,
    estado,
    fecha,
    hora: '09:00',
    createdAt: '',
    updatedAt: '',
    paciente_ID: { _id: 'p1', name: 'Paciente', lastName: 'Uno' },
    medico_ID: {
      _id: medicoUserId,
      name: 'Ana',
      lastName: 'García',
      especialidad: 'Cardiología',
    },
    centroSalud_ID: { _id: 'c1', nombre: 'Centro Norte', direccion: 'Av 1' },
  } as unknown as CitaPopulated;
}

const doctor = makeDoctor('doc-1');
// join key: cita.medico_ID._id === doctor.user._id
const todayCita = makeCita('c1', 'u-doc-1', TODAY);
const otherDayCita = makeCita('c2', 'u-doc-1', '2026-01-01');
const otherDoctorCita = makeCita('c3', 'u-OTHER', TODAY);

function setupMocks(
  role = 'admin',
  params = { id: 'doc-1' },
  citas: CitaPopulated[] = [todayCita, otherDayCita, otherDoctorCita],
) {
  (useParams as unknown as Mock).mockReturnValue(params);
  (useDoctors as unknown as Mock).mockReturnValue({
    data: [doctor],
    isLoading: false,
  });
  (useCitasAdministrator as unknown as Mock).mockReturnValue({
    data: citas,
    isLoading: false,
  });
  (useAuthStore as unknown as Mock).mockImplementation(
    (sel: (s: unknown) => unknown) => sel({ user: { role } }),
  );
}

describe('DoctorDetailPage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders doctor fields when doctor is found', () => {
    setupMocks();
    render(<DoctorDetailPage />);
    expect(screen.getByText(/Ana/i)).toBeInTheDocument();
    expect(screen.getByText(/García/i)).toBeInTheDocument();
    expect(screen.getByText(/Cardiología/i)).toBeInTheDocument();
    expect(screen.getByText(/Centro Norte/i)).toBeInTheDocument();
  });

  it('renders not-found message when doctor ID does not match', () => {
    setupMocks('admin', { id: 'UNKNOWN' });
    render(<DoctorDetailPage />);
    expect(screen.getByText(/no encontrado/i)).toBeInTheDocument();
    expect(screen.queryByText(/Cardiología/i)).not.toBeInTheDocument();
  });

  it('renders slots list', () => {
    setupMocks();
    render(<DoctorDetailPage />);
    expect(screen.getByText('09:00')).toBeInTheDocument();
    expect(screen.getByText('10:00')).toBeInTheDocument();
  });

  it('shows Editar horarios link only for admin role', () => {
    setupMocks('admin');
    render(<DoctorDetailPage />);
    expect(
      screen.getByRole('link', { name: /editar horarios/i }),
    ).toBeInTheDocument();
  });

  it('does NOT show Editar horarios for trabajador_centro', () => {
    setupMocks('trabajador_centro');
    render(<DoctorDetailPage />);
    expect(
      screen.queryByRole('link', { name: /editar horarios/i }),
    ).not.toBeInTheDocument();
  });

  it("lists today's citas matched by medico_ID._id === doctor.user._id", () => {
    setupMocks();
    render(<DoctorDetailPage />);
    // todayCita matches (same doctor user._id, same date)
    expect(screen.getByText('Paciente Uno')).toBeInTheDocument();
  });

  it('shows empty-state when no citas match today for this doctor', () => {
    setupMocks('admin', { id: 'doc-1' }, [otherDayCita, otherDoctorCita]);
    render(<DoctorDetailPage />);
    expect(screen.getByText(/no hay citas/i)).toBeInTheDocument();
  });
});
