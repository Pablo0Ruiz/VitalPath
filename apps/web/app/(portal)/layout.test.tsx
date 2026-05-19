import { render, screen } from '@testing-library/react';
import React from 'react';
import type { Mock } from 'vitest';

// ── Mocks ────────────────────────────────────────────────────────────────────

const mockPathname = vi.fn(() => '/dashboard');

vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
}));

vi.mock('@repo/store', () => ({
  useAuthStore: vi.fn(),
}));

vi.mock('@/components/ui/organisms/Sidebar', () => ({
  Sidebar: () => <div data-testid="sidebar" />,
}));

vi.mock('@/components/ui/organisms/Topbar', () => ({
  Topbar: ({
    breadcrumbs,
  }: {
    breadcrumbs: Array<{ label: string; href?: string }>;
  }) => (
    <nav data-testid="topbar">
      {breadcrumbs.map((bc, i) => (
        <span key={i} data-testid={`crumb-${i}`}>
          {bc.label}
        </span>
      ))}
    </nav>
  ),
}));

vi.mock('@/components/SessionGate', () => ({
  SessionGate: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('@/components/ui/organisms/FloatingChat', () => ({
  default: () => <div data-testid="floating-chat" />,
}));

vi.mock('next/font/local', () => ({ default: () => ({ className: '' }) }));

import { useAuthStore } from '@repo/store';
import PortalLayout from './layout';

function renderLayout(pathname: string) {
  mockPathname.mockReturnValue(pathname);
  (useAuthStore as unknown as Mock).mockReturnValue({
    user: { name: 'Admin', role: 'admin' },
  });
  render(
    <PortalLayout>
      <div />
    </PortalLayout>,
  );
}

describe('PortalLayout breadcrumb resolver', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows "Dashboard" label for /dashboard', () => {
    renderLayout('/dashboard');
    expect(screen.getByTestId('crumb-1')).toHaveTextContent('Dashboard');
  });

  it('shows "Paciente" label for /patients/:objectId', () => {
    renderLayout('/patients/507f1f77bcf86cd799439011');
    expect(screen.getByTestId('crumb-2')).toHaveTextContent('Paciente');
  });

  it('shows "Pacientes" as intermediate breadcrumb on /patients/:objectId', () => {
    renderLayout('/patients/507f1f77bcf86cd799439011');
    expect(screen.getByTestId('crumb-1')).toHaveTextContent('Pacientes');
  });

  it('shows "Portal" as fallback for unknown path', () => {
    renderLayout('/unknown-route');
    expect(screen.getByTestId('crumb-1')).toHaveTextContent('Portal');
  });

  it('does NOT show intermediate "Pacientes" crumb on /patients list page', () => {
    renderLayout('/patients');
    // Only 2 crumbs: VitalPath + Pacientes
    expect(screen.queryByTestId('crumb-2')).not.toBeInTheDocument();
    expect(screen.getByTestId('crumb-1')).toHaveTextContent('Pacientes');
  });
});
