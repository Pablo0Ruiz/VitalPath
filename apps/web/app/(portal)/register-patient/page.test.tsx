import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import type { Mock } from 'vitest';
import RegisterPatientPage from './page';

// ── Mocks ────────────────────────────────────────────────────────────────────

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, replace: vi.fn() }),
}));

vi.mock('@repo/store', () => ({
  useAuthStore: vi.fn(),
}));

vi.mock('@/components/ui/organisms/RegisterPatientForm', () => ({
  RegisterPatientForm: ({
    onSuccess,
  }: {
    onSuccess: (patient: {
      _id: string;
      name: string;
      lastName: string;
    }) => void;
  }) => (
    <button
      onClick={() =>
        onSuccess({
          _id: 'new-patient-id-123',
          name: 'Pedro',
          lastName: 'López',
        })
      }
    >
      Submit
    </button>
  ),
}));

vi.mock('next/font/local', () => ({ default: () => ({ className: '' }) }));

import { useAuthStore } from '@repo/store';

function renderWithQuery(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

describe('RegisterPatientPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    (useAuthStore as unknown as Mock).mockReturnValue({
      user: { role: 'admin' },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('redirects to /patients/:id after successful registration', async () => {
    const { act } = await import('react');
    renderWithQuery(<RegisterPatientPage />);

    const submitBtn = screen.getByRole('button', { name: /Submit/i });

    await act(async () => {
      submitBtn.click();
      vi.advanceTimersByTime(1500);
    });

    expect(mockPush).toHaveBeenCalledWith('/patients/new-patient-id-123');
  });
});
