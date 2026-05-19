import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import type { Mock } from 'vitest';
import PatientProfile from './PatientProfile';
import type { IPatientProfile } from '@repo/types';

// ── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('@repo/api-client', () => ({
  useCitasMedico: vi.fn(),
  useMedicationsByPatient: vi.fn(),
  useResultadosByPatient: vi.fn(),
}));

vi.mock('next/font/local', () => ({ default: () => ({ className: '' }) }));

import {
  useCitasMedico,
  useMedicationsByPatient,
  useResultadosByPatient,
} from '@repo/api-client';

// ── Helpers ───────────────────────────────────────────────────────────────────

const mockPatient: IPatientProfile = {
  _id: '507f1f77bcf86cd799439011',
  name: 'María',
  lastName: 'González',
  email: 'maria@example.com',
  role: 'paciente',
};

function renderWithQuery(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

const loadingState = { data: undefined, isLoading: true, isError: false };
const emptyState = { data: [], isLoading: false, isError: false };

function setupDefaultMocks() {
  (useCitasMedico as unknown as Mock).mockReturnValue(emptyState);
  (useMedicationsByPatient as unknown as Mock).mockReturnValue(emptyState);
  (useResultadosByPatient as unknown as Mock).mockReturnValue(emptyState);
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('PatientProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupDefaultMocks();
  });

  it('renders all 4 tab labels', () => {
    renderWithQuery(<PatientProfile patient={mockPatient} />);

    expect(screen.getByRole('button', { name: /Citas/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Medicamentos/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Notas del médico/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Estudios/i }),
    ).toBeInTheDocument();
  });

  it('renders patient name and email in the header', () => {
    renderWithQuery(<PatientProfile patient={mockPatient} />);

    expect(screen.getByText('María González')).toBeInTheDocument();
    expect(screen.getByText('maria@example.com')).toBeInTheDocument();
  });

  it('shows Citas tab content by default', () => {
    renderWithQuery(<PatientProfile patient={mockPatient} />);

    expect(
      screen.getByText(/Este paciente no tiene citas registradas/i),
    ).toBeInTheDocument();
  });

  it('switches to Medicamentos tab and shows empty state', async () => {
    const user = userEvent.setup();
    renderWithQuery(<PatientProfile patient={mockPatient} />);

    await user.click(screen.getByRole('button', { name: /Medicamentos/i }));

    expect(screen.getByText(/Sin medicamentos activos/i)).toBeInTheDocument();
  });

  it('switches to Notas del médico tab and shows empty state', async () => {
    const user = userEvent.setup();
    renderWithQuery(<PatientProfile patient={mockPatient} />);

    await user.click(screen.getByRole('button', { name: /Notas del médico/i }));

    expect(
      screen.getByText(/Aún no hay notas del médico/i),
    ).toBeInTheDocument();
  });

  it('switches to Estudios tab and shows empty state', async () => {
    const user = userEvent.setup();
    renderWithQuery(<PatientProfile patient={mockPatient} />);

    await user.click(screen.getByRole('button', { name: /Estudios/i }));

    expect(screen.getByText(/Sin estudios cargados/i)).toBeInTheDocument();
  });

  it('shows loading state when Citas is loading', () => {
    (useCitasMedico as unknown as Mock).mockReturnValue(loadingState);
    renderWithQuery(<PatientProfile patient={mockPatient} />);

    expect(screen.getByText(/Cargando/i)).toBeInTheDocument();
  });

  it('shows loading state when Medicamentos is loading', async () => {
    const user = userEvent.setup();
    (useMedicationsByPatient as unknown as Mock).mockReturnValue(loadingState);
    renderWithQuery(<PatientProfile patient={mockPatient} />);

    await user.click(screen.getByRole('button', { name: /Medicamentos/i }));

    expect(screen.getByText(/Cargando/i)).toBeInTheDocument();
  });

  it('shows loading state when Estudios is loading', async () => {
    const user = userEvent.setup();
    (useResultadosByPatient as unknown as Mock).mockReturnValue(loadingState);
    renderWithQuery(<PatientProfile patient={mockPatient} />);

    await user.click(screen.getByRole('button', { name: /Estudios/i }));

    expect(screen.getByText(/Cargando/i)).toBeInTheDocument();
  });

  it('error in one tab does not unmount sibling tabs', async () => {
    const user = userEvent.setup();
    (useCitasMedico as unknown as Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });
    renderWithQuery(<PatientProfile patient={mockPatient} />);

    // Other tabs must still be reachable
    await user.click(screen.getByRole('button', { name: /Medicamentos/i }));
    expect(screen.getByText(/Sin medicamentos activos/i)).toBeInTheDocument();
  });
});
