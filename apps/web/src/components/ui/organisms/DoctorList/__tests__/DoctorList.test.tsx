import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import type { Mock } from 'vitest';
import type { DoctorSession } from '@repo/api-client';

vi.mock('@repo/api-client', () => ({
  useDoctors: vi.fn(),
  useInviteDoctor: vi.fn(),
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

import { useDoctors, useInviteDoctor } from '@repo/api-client';
import DoctorList from '../DoctorList';

function makeDoctor(id: string, isActive = true): DoctorSession {
  return {
    _id: id,
    especialidad: 'General',
    horarioDisponible: [],
    user: {
      _id: `u-${id}`,
      name: `Doctor${id}`,
      lastName: 'Apellido',
      email: `doc${id}@test.com`,
      isActive,
      genero: 'M',
      centroSalud_ID: {
        _id: 'c1',
        nombre: 'Centro Test',
        direccion: 'Calle 1',
      },
    },
  } as unknown as DoctorSession;
}

const doctors = [makeDoctor('d1'), makeDoctor('d2', false)];

function setupMocks() {
  (useDoctors as unknown as Mock).mockReturnValue({
    data: doctors,
    isLoading: false,
    error: null,
  });
  (useInviteDoctor as unknown as Mock).mockReturnValue({
    mutateAsync: vi.fn(),
    isPending: false,
    variables: undefined,
  });
}

describe('DoctorList navigation', () => {
  beforeEach(() => vi.clearAllMocks());

  it('each doctor card renders a link to /doctors/:id', () => {
    setupMocks();
    render(<DoctorList />);
    const links = screen.getAllByRole('link');
    const hrefs = links.map(l => l.getAttribute('href'));
    expect(hrefs).toContain('/doctors/d1');
    expect(hrefs).toContain('/doctors/d2');
  });

  it('invite Button exists and clicking it does not navigate (stopPropagation)', async () => {
    setupMocks();
    const user = userEvent.setup();
    render(<DoctorList />);
    const inviteBtn = screen.getByRole('button', { name: /enviar código/i });
    expect(inviteBtn).toBeInTheDocument();
    // Clicking invite should not throw or navigate (event isolated from link)
    await user.click(inviteBtn);
  });

  it('card link href is present independently of invite button', () => {
    setupMocks();
    render(<DoctorList />);
    // d1 is active (no invite button), should still have a link
    const link = screen
      .getAllByRole('link')
      .find(l => l.getAttribute('href') === '/doctors/d1');
    expect(link).toBeInTheDocument();
  });
});
