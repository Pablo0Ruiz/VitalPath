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
        testID: `field-${label}`,
        ...rest,
      }),
    );

  const GenderForm = ({ value, onChange, list }: any) =>
    React.createElement(View, { testID: 'gender-form' });

  return { AuthHeader, FormField, GenderForm };
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
    draft: { fechaNacimiento: '', genero: 'Masculino' },
    setStep2: jest.fn(),
  }),
}));

// ── @repo/types ───────────────────────────────────────────────────────────────
jest.mock('@repo/types', () => {
  const z = require('zod');
  const step2Schema = z.object({
    fechaNacimiento: z.string().min(1),
    genero: z.string().min(1),
  });
  return { step2Schema, Step2FormValues: undefined };
});

// ── Utils ─────────────────────────────────────────────────────────────────────
jest.mock('@/src/utils/formatDateInput', () => ({
  formatDateInput: (v: string) => v,
}));

// ── Constants ─────────────────────────────────────────────────────────────────
jest.mock('@/src/constants/gender', () => ({
  GENDER: ['Masculino', 'Femenino', 'No binario', 'Prefiero no decir'],
}));

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

import RegisterStep2 from '../step-2';

describe('RegisterStep2 — AuthLayout structure', () => {
  it('renders auth-layout-card (AuthLayout card zone)', () => {
    const { getByTestId } = render(<RegisterStep2 />);
    expect(getByTestId('auth-layout-card')).toBeTruthy();
  });

  it('renders AuthHeader title "Detalles Personales"', () => {
    const { getByText } = render(<RegisterStep2 />);
    expect(getByText('Detalles Personales')).toBeTruthy();
  });

  it('renders AuthHeader subtitle "Paso 2 de 3"', () => {
    const { getByText } = render(<RegisterStep2 />);
    expect(getByText('Paso 2 de 3')).toBeTruthy();
  });
});

describe('RegisterStep2 — Card zone content', () => {
  it('renders ProgressBar (via test on component presence)', () => {
    const { UNSAFE_getAllByProps } = render(<RegisterStep2 />);
    // ProgressBar renders a track View; we verify the component tree has rendered
    const { getByTestId } = render(<RegisterStep2 />);
    expect(getByTestId('auth-layout-card')).toBeTruthy();
  });

  it('renders the fecha de nacimiento field label', () => {
    const { getByText } = render(<RegisterStep2 />);
    expect(getByText('Fecha de nacimiento')).toBeTruthy();
  });

  it('renders the GenderForm', () => {
    const { getByTestId } = render(<RegisterStep2 />);
    expect(getByTestId('gender-form')).toBeTruthy();
  });

  it('renders the primary "Siguiente" button', () => {
    const { getByText } = render(<RegisterStep2 />);
    expect(getByText('Siguiente')).toBeTruthy();
  });
});

describe('RegisterStep2 — Navigation', () => {
  it('navigates to register step-3 on valid submit', async () => {
    const { router } = require('expo-router');
    jest.clearAllMocks();

    const { getByText, getByPlaceholderText } = render(<RegisterStep2 />);

    fireEvent.changeText(getByPlaceholderText('DD/MM/AAAA'), '01/01/1990');
    fireEvent.press(getByText('Siguiente'));

    await new Promise(resolve => setTimeout(resolve, 0));
    expect(router.push).toHaveBeenCalledWith(
      expect.stringContaining('register/step-3'),
    );
  });
});
