import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import type { Mock } from 'vitest';
import PatientProfilePage from './page';

// ── Mocks ────────────────────────────────────────────────────────────────────

const mockReplace = vi.fn();

vi.mock('next/navigation', () => ({
  useParams: vi.fn(),
  useRouter: () => ({ replace: mockReplace }),
  notFound: vi.fn(),
}));

vi.mock('@repo/api-client', () => ({
  usePatientById: vi.fn(),
}));

vi.mock('@/components/ui/organisms/PatientProfile', () => ({
  PatientProfile: ({ patient }: { patient: { name: string } }) => (
    <div data-testid="patient-profile">{patient.name}</div>
  ),
}));

vi.mock('next/font/local', () => ({ default: () => ({ className: '' }) }));

import { useParams, notFound } from 'next/navigation';
import { usePatientById } from '@repo/api-client';

function renderWithQuery(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

const mockPatient = {
  _id: 'abc123',
  name: 'María',
  lastName: 'González',
  email: 'maria@test.com',
  role: 'PACIENTE',
};

describe('PatientProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useParams as Mock).mockReturnValue({ id: 'abc123' });
  });

  it('renders loading state while fetching', () => {
    (usePatientById as Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    });
    renderWithQuery(<PatientProfilePage />);
    expect(screen.getByText(/cargando perfil/i)).toBeInTheDocument();
  });

  it('renders PatientProfile when patient is loaded', () => {
    (usePatientById as Mock).mockReturnValue({
      data: mockPatient,
      isLoading: false,
      isError: false,
      error: null,
    });
    renderWithQuery(<PatientProfilePage />);
    expect(screen.getByTestId('patient-profile')).toBeInTheDocument();
    expect(screen.getByText('María')).toBeInTheDocument();
  });

  it('calls notFound() on 404 error', () => {
    (usePatientById as Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: { response: { status: 404 } },
    });
    renderWithQuery(<PatientProfilePage />);
    expect(notFound).toHaveBeenCalled();
  });

  it('redirects to /dashboard on 403 error', async () => {
    (usePatientById as Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: { response: { status: 403 } },
    });
    const { act } = await import('react');
    await act(async () => {
      renderWithQuery(<PatientProfilePage />);
    });
    expect(mockReplace).toHaveBeenCalledWith('/dashboard');
  });

  it('redirects to /dashboard on 401 error', async () => {
    (usePatientById as Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: { response: { status: 401 } },
    });
    const { act } = await import('react');
    await act(async () => {
      renderWithQuery(<PatientProfilePage />);
    });
    expect(mockReplace).toHaveBeenCalledWith('/dashboard');
  });
});
