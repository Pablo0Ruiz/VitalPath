import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { Mock } from 'vitest';
import PatientList from './PatientList';

vi.mock('@repo/api-client', () => ({
  useCitasMedico: vi.fn(),
}));

vi.mock('next/font/local', () => ({ default: () => ({ className: '' }) }));

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

import { useCitasMedico } from '@repo/api-client';

function renderWithQuery(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

const mockCita = {
  _id: 'cita-1',
  fecha: '2026-05-19',
  hora: '10:00',
  estado: 'agendada',
  paciente_ID: {
    _id: '507f1f77bcf86cd799439011',
    name: 'María',
    lastName: 'González',
  },
  medico_ID: {
    _id: 'doc-1',
    name: 'Juan',
    lastName: 'Pérez',
    especialidad: 'General',
  },
  centroSalud_ID: { _id: 'cs-1', nombre: 'Centro', direccion: 'Calle 1' },
  createdAt: '',
  updatedAt: '',
  centroSalud: '',
};

describe('PatientList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state while fetching', () => {
    (useCitasMedico as unknown as Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });
    renderWithQuery(<PatientList />);
    expect(screen.getByText(/Cargando pacientes/i)).toBeInTheDocument();
  });

  it('renders an anchor with correct href for each patient row', () => {
    (useCitasMedico as unknown as Mock).mockReturnValue({
      data: [mockCita],
      isLoading: false,
      isError: false,
    });
    renderWithQuery(<PatientList />);

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute(
      'href',
      `/patients/${mockCita.paciente_ID._id}`,
    );
  });

  it('shows patient name inside the link', () => {
    (useCitasMedico as unknown as Mock).mockReturnValue({
      data: [mockCita],
      isLoading: false,
      isError: false,
    });
    renderWithQuery(<PatientList />);

    expect(screen.getByText('María González')).toBeInTheDocument();
  });
});
