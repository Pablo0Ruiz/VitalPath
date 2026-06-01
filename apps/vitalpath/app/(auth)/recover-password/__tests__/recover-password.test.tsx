import React from 'react';
import { render } from '@testing-library/react-native';
import { KeyboardAvoidingView } from 'react-native';

// ── LinearGradient mock ───────────────────────────────────────────────────────
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: jest.fn().mockImplementation(({ children }) => children),
}));

// ── Mock molecules barrel to avoid complex dependency chain ──────────────────
jest.mock('@/src/components/ui/molecules', () => {
  const React = require('react');
  const { View, TouchableOpacity } = require('react-native');
  const { useTheme } = require('@/src/hooks/useTheme');

  const AuthHeader = ({ title, subtitle }) =>
    React.createElement(
      View,
      { testID: 'auth-header' },
      React.createElement(
        require('@/src/components/ui/atoms').TextField,
        { variant: 'title' },
        title,
      ),
      subtitle
        ? React.createElement(
            require('@/src/components/ui/atoms').TextField,
            { variant: 'caption' },
            subtitle,
          )
        : null,
    );

  const AuthFooterLink = ({ text, linkText, onPress }) => {
    const t = useTheme();
    return React.createElement(
      TouchableOpacity,
      {
        accessibilityRole: 'link',
        onPress,
        style: { minHeight: t.minTouchTarget },
      },
      React.createElement(
        require('@/src/components/ui/atoms').TextField,
        { variant: 'caption' },
        text,
      ),
      React.createElement(
        require('@/src/components/ui/atoms').TextField,
        { variant: 'caption' },
        linkText,
      ),
    );
  };

  const FormField = ({ label, ...props }) => {
    const t = useTheme();
    return React.createElement(
      View,
      {},
      React.createElement(
        require('@/src/components/ui/atoms').TextField,
        { variant: 'body' },
        label,
      ),
    );
  };

  return { AuthHeader, AuthFooterLink, FormField };
});

// ── Mock complex organism dependencies to avoid barrel chain issues ────────────
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

// ── @repo/types mock (zod schemas) ───────────────────────────────────────────
jest.mock('@repo/types', () => {
  const z = require('zod');
  const recoverPasswordSchema = z.object({ email: z.string().email() });
  return {
    recoverPasswordSchema,
    RecoverPasswordFormValues: undefined,
  };
});

// ── expo-router is mocked globally in jest.setup.js ──────────────────────────

import RecoverPassword from '../index';

// ── Hero zone tests ───────────────────────────────────────────────────────────
describe('RecoverPassword screen — Hero', () => {
  it('renders AuthHeader title "Recuperar contraseña"', () => {
    const { getByText } = render(<RecoverPassword />);
    expect(getByText('Recuperar contraseña')).toBeTruthy();
  });

  it('wraps content in a KeyboardAvoidingView (via AuthLayout)', () => {
    const { UNSAFE_getByType } = render(<RecoverPassword />);
    expect(UNSAFE_getByType(KeyboardAvoidingView)).toBeTruthy();
  });
});

// ── Form card tests ───────────────────────────────────────────────────────────
describe('RecoverPassword screen — Form', () => {
  it('renders the email FormField label', () => {
    const { getByText } = render(<RecoverPassword />);
    expect(getByText('Correo electrónico')).toBeTruthy();
  });

  it('renders the submit button', () => {
    const { getByText } = render(<RecoverPassword />);
    expect(getByText('Enviar instrucciones')).toBeTruthy();
  });
});

// ── Footer tests ──────────────────────────────────────────────────────────────
describe('RecoverPassword screen — Footer', () => {
  it('renders footer prompt text via AuthFooterLink', () => {
    const { getByText } = render(<RecoverPassword />);
    expect(getByText('¿Recordaste tu contraseña?')).toBeTruthy();
  });

  it('renders footer link text "Iniciar sesión" via AuthFooterLink', () => {
    const { getByText } = render(<RecoverPassword />);
    expect(getByText('Iniciar sesión')).toBeTruthy();
  });

  it('footer root has accessibilityRole="link" (AuthFooterLink contract)', () => {
    const { UNSAFE_getAllByProps } = render(<RecoverPassword />);
    const links = UNSAFE_getAllByProps({ accessibilityRole: 'link' });
    expect(links.length).toBeGreaterThanOrEqual(1);
  });
});
