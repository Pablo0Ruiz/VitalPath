import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

// ── LinearGradient mock ──────────────────────────────────────────────────────
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: jest.fn().mockImplementation(({ children }) => children),
}));

// ── Theme ────────────────────────────────────────────────────────────────────
jest.mock('@/src/hooks/useTheme', () => ({
  useTheme: () => ({
    background: '#F6F4F9',
    surface: '#FDFCFF',
    surfaceElevated: '#FFFFFF',
    textPrimary: '#1C1030',
    textSecondary: '#5C5670',
    textInverse: '#FFFFFF',
    border: '#E5DEED',
    primary600: '#4f6ef7',
    neutral100: '#F4F4F5',
    error: '#FF4D6A',
    white: '#FFFFFF',
    fontSizeDisplay: 32,
    fontSizeTitle: 28,
    fontSizeBody: 15,
    fontSizeCaption: 13,
    fontSizeLabel: 11,
    radiusSheet: 24,
    minTouchTarget: 44,
  }),
}));

// ── Mock molecules barrel ────────────────────────────────────────────────────
jest.mock('@/src/components/ui/molecules', () => {
  const React = require('react');
  const { View, TextInput } = require('react-native');
  const { TextField } = require('@/src/components/ui/atoms');

  const AuthHeader = ({
    title,
    subtitle,
  }: {
    title: string;
    subtitle?: string;
  }) =>
    React.createElement(
      View,
      { testID: 'auth-header' },
      React.createElement(TextField, { variant: 'title' }, title),
      subtitle
        ? React.createElement(TextField, { variant: 'caption' }, subtitle)
        : null,
    );

  const FormField = ({
    label,
    placeholder,
    onChangeText,
    onBlur,
    value,
    helperText,
    secureTextEntry,
    rightIcon,
    ...rest
  }: any) =>
    React.createElement(
      View,
      null,
      React.createElement(TextField, { variant: 'body' }, label),
      React.createElement(TextInput, {
        placeholder,
        onChangeText,
        onBlur,
        value,
        secureTextEntry,
        testID: `field-${label}`,
        ...rest,
      }),
      rightIcon || null,
    );

  return { AuthHeader, FormField };
});

// ── Mock organisms barrel ────────────────────────────────────────────────────
jest.mock('@/src/components/ui/organisms', () => {
  const React = require('react');
  const {
    ScrollView,
    KeyboardAvoidingView,
    View,
    Platform,
  } = require('react-native');
  const { SafeAreaView } = require('react-native-safe-area-context');
  const { useTheme } = require('@/src/hooks/useTheme');

  const AuthLayout = ({ heroContent, children, noCard = false }: any) => {
    const t = useTheme();
    return React.createElement(
      SafeAreaView,
      { style: { flex: 1, backgroundColor: t.background } },
      React.createElement(
        KeyboardAvoidingView,
        {
          style: { flex: 1 },
          behavior: Platform.OS === 'ios' ? 'padding' : 'height',
        },
        React.createElement(
          ScrollView,
          {
            keyboardShouldPersistTaps: 'handled',
            showsVerticalScrollIndicator: false,
          },
          heroContent,
          noCard
            ? children
            : React.createElement(
                View,
                { testID: 'auth-layout-card' },
                children,
              ),
        ),
      ),
    );
  };

  return { AuthLayout };
});

// ── Register store ────────────────────────────────────────────────────────────
jest.mock('@repo/store', () => ({
  useRegisterStore: () => ({
    draft: {
      name: 'Test',
      lastName: 'User',
      fechaNacimiento: '01/01/1990',
      genero: 'Masculino',
      email: '',
      password: '',
    },
    setStep3: jest.fn(),
    getAll: jest.fn(() => ({
      name: 'Test',
      lastName: 'User',
      fechaNacimiento: '01/01/1990',
      genero: 'Masculino',
      email: 'test@example.com',
      password: 'password123',
    })),
    reset: jest.fn(),
  }),
}));

// ── API client ────────────────────────────────────────────────────────────────
jest.mock('@repo/api-client', () => ({
  useRegister: () => ({ mutate: jest.fn(), isPending: false }),
  parseApiError: (err: any) => ({ message: err?.message ?? 'Error' }),
}));

// ── Auth store ────────────────────────────────────────────────────────────────
jest.mock('@/src/stores/auth', () => ({
  useAuthStore: () => ({ setSession: jest.fn() }),
}));

// ── Senior UI store ──────────────────────────────────────────────────────────
jest.mock('@/src/stores/seniorUI.store', () => ({
  useSeniorUIStore: () => ({ hasSeenSuggestion: false }),
}));

// ── Adapters ─────────────────────────────────────────────────────────────────
jest.mock('@/src/adapters/mobileTokenAdapter', () => ({
  mobileTokenAdapter: {},
}));

// ── Utils ─────────────────────────────────────────────────────────────────────
jest.mock('@/src/utils/date', () => ({
  isElderlyUser: jest.fn(() => false),
}));

// ── @repo/types ───────────────────────────────────────────────────────────────
jest.mock('@repo/types', () => {
  const z = require('zod');
  const step3Schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });
  return { step3Schema, Step3FormValues: undefined };
});

// ── Vector icons ──────────────────────────────────────────────────────────────
jest.mock('@expo/vector-icons/Octicons', () => 'Octicons');

// ── Safe area context ─────────────────────────────────────────────────────────
jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  const React = require('react');
  return {
    SafeAreaView: ({ children, ...props }: React.PropsWithChildren<object>) =>
      React.createElement(
        View,
        { testID: 'safe-area-view', ...props },
        children,
      ),
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});

import RegisterStep3 from '../step-3';

describe('RegisterStep3 — AuthLayout structure', () => {
  it('renders auth-layout-card (AuthLayout card zone)', () => {
    const { getByTestId } = render(<RegisterStep3 />);
    expect(getByTestId('auth-layout-card')).toBeTruthy();
  });

  it('renders AuthHeader title "Credenciales"', () => {
    const { getByText } = render(<RegisterStep3 />);
    expect(getByText('Credenciales')).toBeTruthy();
  });

  it('renders AuthHeader subtitle "Paso 3 de 3"', () => {
    const { getByText } = render(<RegisterStep3 />);
    expect(getByText('Paso 3 de 3')).toBeTruthy();
  });
});

describe('RegisterStep3 — Card zone content', () => {
  it('renders the email field label', () => {
    const { getByText } = render(<RegisterStep3 />);
    expect(getByText('Correo electrónico')).toBeTruthy();
  });

  it('renders the password field label', () => {
    const { getByText } = render(<RegisterStep3 />);
    expect(getByText('Contraseña')).toBeTruthy();
  });

  it('renders the primary "Finalizar Registro" button', () => {
    const { getByText } = render(<RegisterStep3 />);
    expect(getByText('Finalizar Registro')).toBeTruthy();
  });
});

describe('RegisterStep3 — isPending state', () => {
  it('shows "Finalizar Registro" when isPending=false (default mock)', () => {
    const { getByText } = render(<RegisterStep3 />);
    expect(getByText('Finalizar Registro')).toBeTruthy();
  });
});
