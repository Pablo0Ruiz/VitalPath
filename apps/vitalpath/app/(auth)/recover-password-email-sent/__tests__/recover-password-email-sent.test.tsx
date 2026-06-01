import React from 'react';
import { render } from '@testing-library/react-native';
import { KeyboardAvoidingView } from 'react-native';

// ── LinearGradient mock ───────────────────────────────────────────────────────
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: jest.fn().mockImplementation(({ children }) => children),
}));

// ── Theme mock ────────────────────────────────────────────────────────────────
jest.mock('@/src/hooks/useTheme', () => ({
  useTheme: () => ({
    background: '#F5F7FC',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    textInverse: '#FFFFFF',
    border: '#E4E7EF',
    primary600: '#4f6ef7',
    success: '#10B981',
    fontSizeTitle: 24,
    fontSizeBody: 15,
    fontSizeCaption: 13,
    fontSizeLabel: 11,
    radiusSheet: 24,
    minTouchTarget: 44,
  }),
}));

// ── API client mock ───────────────────────────────────────────────────────────
jest.mock('@repo/api-client', () => ({
  useRecoverPassword: () => ({ mutateAsync: jest.fn(), isPending: false }),
}));

// ── Vector icons — explicit default export mock for sub-path imports ──────────
jest.mock('@expo/vector-icons/Octicons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return ({ name, testID, ...props }) =>
    React.createElement(
      Text,
      { testID: testID || `icon-${name}`, ...props },
      name,
    );
});

// ── expo-router mocked globally; override useLocalSearchParams for email param
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
  useLocalSearchParams: () => ({ email: 'test@ejemplo.com' }),
  router: {
    replace: jest.fn(),
    canGoBack: jest.fn(() => true),
    back: jest.fn(),
  },
}));

// ── Mock atoms barrel to avoid deep dependency chains ────────────────────────
jest.mock('@/src/components/ui/atoms', () => {
  const React = require('react');
  const { Text, TouchableOpacity } = require('react-native');

  const TextField = ({ children, variant, style, ...props }) =>
    React.createElement(Text, { style, ...props }, children);

  const Button = ({ title, onPress, variant, style, disabled }) =>
    React.createElement(
      TouchableOpacity,
      { onPress, style, disabled, accessibilityRole: 'button' },
      React.createElement(Text, {}, title),
    );

  return { TextField, Button };
});

// ── Mock molecules barrel ─────────────────────────────────────────────────────
jest.mock('@/src/components/ui/molecules', () => {
  const React = require('react');
  const { View, Text } = require('react-native');

  const AuthHeader = ({ title, subtitle }) =>
    React.createElement(
      View,
      { testID: 'auth-header' },
      React.createElement(Text, { testID: 'auth-header-title' }, title),
      subtitle
        ? React.createElement(
            Text,
            { testID: 'auth-header-subtitle' },
            subtitle,
          )
        : null,
    );

  return { AuthHeader };
});

// ── Mock organisms barrel ─────────────────────────────────────────────────────
jest.mock('@/src/components/ui/organisms', () => {
  const React = require('react');
  const {
    View,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
  } = require('react-native');
  const { SafeAreaView } = require('react-native-safe-area-context');
  const { useTheme } = require('@/src/hooks/useTheme');

  const AuthLayout = ({ heroContent, children, noCard = false }) => {
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

import RecoverPasswordEmailSent from '../index';

// ── Render tests ──────────────────────────────────────────────────────────────
describe('RecoverPasswordEmailSent screen — renders without crash', () => {
  it('renders without crashing when email param is provided', () => {
    expect(() => render(<RecoverPasswordEmailSent />)).not.toThrow();
  });

  it('wraps content in a KeyboardAvoidingView (via AuthLayout)', () => {
    const { UNSAFE_getByType } = render(<RecoverPasswordEmailSent />);
    expect(UNSAFE_getByType(KeyboardAvoidingView)).toBeTruthy();
  });
});

// ── Confirmation title tests ──────────────────────────────────────────────────
describe('RecoverPasswordEmailSent screen — Confirmation content', () => {
  it('shows "¡Correo enviado!" confirmation title in AuthHeader', () => {
    const { getByText } = render(<RecoverPasswordEmailSent />);
    expect(getByText('¡Correo enviado!')).toBeTruthy();
  });

  it('shows success icon (check-circle-fill)', () => {
    const { getByTestId } = render(<RecoverPasswordEmailSent />);
    // The Octicons mock renders icon name as text in a Text with testID "icon-{name}"
    expect(getByTestId('icon-check-circle-fill')).toBeTruthy();
  });
});

// ── Action buttons tests ──────────────────────────────────────────────────────
describe('RecoverPasswordEmailSent screen — Buttons', () => {
  it('shows "Volver al inicio de sesión" primary button', () => {
    const { getByText } = render(<RecoverPasswordEmailSent />);
    expect(getByText('Volver al inicio de sesión')).toBeTruthy();
  });

  it('shows "Reenviar" outline button', () => {
    const { getByText } = render(<RecoverPasswordEmailSent />);
    // The resend button text may include "Reenviar"
    expect(getByText(/Reenviar/)).toBeTruthy();
  });
});
