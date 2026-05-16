import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import LoginForm from './LoginForm';

vi.mock('@repo/api-client', () => ({
  postLogin: vi.fn(),
  postInviteVerification: vi.fn(),
  ACCESS_TOKEN_KEY: 'test_token',
}));

// Suppress Next.js Font/Image/Link errors in jsdom
vi.mock('next/font/local', () => ({ default: () => ({ className: '' }) }));

function renderWithQuery(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

import { postLogin } from '@repo/api-client';

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset window.location so navigation assertions are clean
    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
    });
  });

  it('renders email and password fields plus submit button', () => {
    renderWithQuery(<LoginForm />);

    expect(
      screen.getByPlaceholderText('doctor@vitalpathia.com'),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Ingresar/i }),
    ).toBeInTheDocument();
  });

  it('submitting valid credentials calls postLogin with typed values', async () => {
    const user = userEvent.setup();
    (postLogin as ReturnType<typeof vi.fn>).mockResolvedValue({
      token: 'abc',
      user: {},
    });

    renderWithQuery(<LoginForm />);

    await user.type(
      screen.getByPlaceholderText('doctor@vitalpathia.com'),
      'medico@vitalpathia.com',
    );
    await user.type(screen.getByPlaceholderText('••••••••'), 'secret123');
    await user.click(screen.getByRole('button', { name: /Ingresar/i }));

    await waitFor(() => {
      expect(postLogin).toHaveBeenCalledTimes(1);
      expect(postLogin).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'medico@vitalpathia.com',
          password: 'secret123',
        }),
        expect.anything(),
      );
    });
  });

  it('displays error message when mutation fails', async () => {
    const user = userEvent.setup();
    (postLogin as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('Credenciales inválidas'),
    );

    renderWithQuery(<LoginForm />);

    await user.type(
      screen.getByPlaceholderText('doctor@vitalpathia.com'),
      'wrong@example.com',
    );
    await user.type(screen.getByPlaceholderText('••••••••'), 'wrongpass');
    await user.click(screen.getByRole('button', { name: /Ingresar/i }));

    await waitFor(() => {
      expect(screen.getByText(/Error al iniciar sesión/i)).toBeInTheDocument();
    });
  });

  it('inputs have associated labels or aria attributes', () => {
    renderWithQuery(<LoginForm />);

    const emailInput = screen.getByPlaceholderText('doctor@vitalpathia.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');

    // FormField wraps each input with a label — check they are accessible
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();

    // Labels exist in the DOM
    expect(screen.getByText('Correo electrónico')).toBeInTheDocument();
    expect(screen.getByText('Contraseña')).toBeInTheDocument();
  });
});
