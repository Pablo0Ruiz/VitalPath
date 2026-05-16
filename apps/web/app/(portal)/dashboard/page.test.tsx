import { render, screen } from '@testing-library/react';
import React from 'react';
import { type Mock } from 'vitest';
import DashboardPage from './page';

vi.mock('@repo/store', () => ({
  useAuthStore: vi.fn(),
}));

vi.mock('@/components/ui/organisms/DashboardDoctor', () => ({
  DashboardDoctor: () => <div data-testid="dashboard-doctor" />,
}));

vi.mock('@/components/ui/organisms/DashboardAdmin', () => ({
  DashboardAdmin: () => <div data-testid="dashboard-admin" />,
}));

vi.mock('next/font/local', () => ({ default: () => ({ className: '' }) }));

import { useAuthStore } from '@repo/store';

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders DashboardDoctor for medico role', () => {
    (useAuthStore as unknown as Mock).mockImplementation(
      (sel: (s: unknown) => unknown) => sel({ user: { role: 'medico' } }),
    );
    render(<DashboardPage />);
    expect(screen.getByTestId('dashboard-doctor')).toBeInTheDocument();
  });

  it('renders DashboardAdmin for admin role', () => {
    (useAuthStore as unknown as Mock).mockImplementation(
      (sel: (s: unknown) => unknown) => sel({ user: { role: 'admin' } }),
    );
    render(<DashboardPage />);
    expect(screen.getByTestId('dashboard-admin')).toBeInTheDocument();
  });

  it('renders DashboardAdmin when user is undefined', () => {
    (useAuthStore as unknown as Mock).mockImplementation(
      (sel: (s: unknown) => unknown) => sel({ user: undefined }),
    );
    render(<DashboardPage />);
    expect(screen.getByTestId('dashboard-admin')).toBeInTheDocument();
  });
});
