import { render, screen } from '@testing-library/react';
import React from 'react';
import { SessionGate } from './SessionGate';

vi.mock('@repo/store', () => ({
  useAuthStore: vi.fn(),
}));

vi.mock('@repo/api-client', () => ({
  useSession: vi.fn(),
  ACCESS_TOKEN_KEY: 'test_token',
}));

vi.mock('@/adapters/webTokenAdapter', () => ({
  webTokenAdapter: {
    getToken: vi.fn(),
    setToken: vi.fn(),
    deleteToken: vi.fn(),
    navigate: vi.fn(),
  },
}));

vi.mock('next/font/local', () => ({ default: () => ({ className: '' }) }));

import { useAuthStore } from '@repo/store';
import { useSession } from '@repo/api-client';
import { webTokenAdapter } from '@/adapters/webTokenAdapter';

describe('SessionGate', () => {
  const mockSetSession = vi.fn();
  const mockClearSession = vi.fn();
  const mockSetIsLoading = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      setSession: mockSetSession,
      clearSession: mockClearSession,
      setIsLoading: mockSetIsLoading,
    });
    (useSession as ReturnType<typeof vi.fn>).mockReturnValue(undefined);
  });

  it('renders children', () => {
    render(
      <SessionGate>
        <div data-testid="child" />
      </SessionGate>,
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('calls useSession with webTokenAdapter as first argument', () => {
    render(
      <SessionGate>
        <div />
      </SessionGate>,
    );
    expect(useSession).toHaveBeenCalledWith(
      webTokenAdapter,
      expect.any(Object),
    );
  });

  it('forwards auth store callbacks to useSession', () => {
    render(
      <SessionGate>
        <div />
      </SessionGate>,
    );
    expect(useSession).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        setSession: mockSetSession,
        clearSession: mockClearSession,
        setIsLoading: mockSetIsLoading,
      }),
    );
  });

  it('does not crash when useAuthStore returns undefined callbacks', () => {
    (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      setSession: undefined,
      clearSession: undefined,
      setIsLoading: undefined,
    });
    expect(() =>
      render(
        <SessionGate>
          <div />
        </SessionGate>,
      ),
    ).not.toThrow();
  });
});
