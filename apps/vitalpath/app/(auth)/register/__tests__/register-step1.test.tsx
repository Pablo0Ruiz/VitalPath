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
    primary50: '#F5F0FB',
    primary100: '#EBE1F7',
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

// ── Mock molecules barrel to avoid complex dependency chain ──────────────────
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

  const Divider = ({ text }: { text?: string }) =>
    React.createElement(
      View,
      { testID: 'divider' },
      text
        ? React.createElement(TextField, { variant: 'caption' }, text)
        : null,
    );

  return { AuthHeader, FormField, Divider };
});

// ── Mock organisms barrel to avoid barrel chain issues ───────────────────────
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
    draft: { name: '', lastName: '' },
    setStep1: jest.fn(),
  }),
}));

// ── @repo/types ───────────────────────────────────────────────────────────────
jest.mock('@repo/types', () => {
  const z = require('zod');
  const step1Schema = z.object({
    name: z.string().min(1),
    lastName: z.string().min(1),
  });
  return { step1Schema, Step1FormValues: undefined };
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

import RegisterStep1 from '../index';

describe('RegisterStep1 — AuthLayout structure', () => {
  it('renders auth-layout-card (AuthLayout card zone)', () => {
    const { getByTestId } = render(<RegisterStep1 />);
    expect(getByTestId('auth-layout-card')).toBeTruthy();
  });

  it('renders AuthHeader title "Crear cuenta"', () => {
    const { getByText } = render(<RegisterStep1 />);
    expect(getByText('Crear cuenta')).toBeTruthy();
  });

  it('renders AuthHeader subtitle "Comienza a monitorear tu salud (1/3)"', () => {
    const { getByText } = render(<RegisterStep1 />);
    expect(getByText('Comienza a monitorear tu salud (1/3)')).toBeTruthy();
  });
});

describe('RegisterStep1 — Card zone content', () => {
  it('renders the name field label', () => {
    const { getByText } = render(<RegisterStep1 />);
    expect(getByText('Nombre completo')).toBeTruthy();
  });

  it('renders the lastName field label', () => {
    const { getByText } = render(<RegisterStep1 />);
    expect(getByText('Apellido')).toBeTruthy();
  });

  it('renders the primary "Siguiente" button', () => {
    const { getByText } = render(<RegisterStep1 />);
    expect(getByText('Siguiente')).toBeTruthy();
  });
});

describe('RegisterStep1 — Navigation', () => {
  it('navigates to register step-2 on valid submit', async () => {
    const { router } = require('expo-router');
    jest.clearAllMocks();

    const { getByText, getByPlaceholderText } = render(<RegisterStep1 />);

    fireEvent.changeText(getByPlaceholderText('Juan Pérez'), 'Juan');
    fireEvent.changeText(getByPlaceholderText('Perez'), 'Perez');
    fireEvent.press(getByText('Siguiente'));

    await new Promise(resolve => setTimeout(resolve, 0));
    expect(router.push).toHaveBeenCalledWith(
      expect.stringContaining('register/step-2'),
    );
  });
});
