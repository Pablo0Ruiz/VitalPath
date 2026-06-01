import React from 'react';
import { render } from '@testing-library/react-native';
import { KeyboardAvoidingView } from 'react-native';

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: jest.fn().mockImplementation(({ children }) => children),
}));

jest.mock('@/src/hooks/useTheme', () => ({
  useTheme: () => ({
    background: '#F5F7FC',
    surface: '#FFFFFF',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    textInverse: '#FFFFFF',
    primary600: '#4f6ef7',
    primary100: '#EEF2FF',
    primary200: '#E0E7FF',
    border: '#E4E7EF',
    fontSizeTitle: 24,
    fontSizeBody: 15,
    fontSizeCaption: 13,
    fontSizeLabel: 11,
    radiusSheet: 24,
    minTouchTarget: 44,
    white: '#FFFFFF',
    error: '#DC2626',
  }),
}));

jest.mock('@repo/api-client', () => ({
  useRegisterCuidador: () => ({ mutate: jest.fn(), isPending: false }),
  parseApiError: (e: unknown) => ({ message: String(e) }),
}));

jest.mock('@/src/stores/auth', () => ({
  useAuthStore: () => ({ setSession: jest.fn() }),
}));

jest.mock('@repo/types', () => ({
  registerCuidadorSchema: { parse: jest.fn() },
}));

jest.mock('@hookform/resolvers/zod', () => ({
  zodResolver: () => jest.fn(),
}));

jest.mock('@/src/utils/formatDateInput', () => ({
  formatDateInput: (t: string) => t,
}));

jest.mock('@/src/adapters/mobileTokenAdapter', () => ({
  mobileTokenAdapter: jest.fn(),
}));

jest.mock('@/src/constants/gender', () => ({
  GENDER: ['Masculino', 'Femenino', 'Otro'],
}));

jest.mock('@/src/routes/routes', () => ({
  ROUTES: { LOGIN: '/login', HOME: '/home' },
}));

jest.mock('@expo/vector-icons/Octicons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return ({ name, ...props }) =>
    React.createElement(Text, { testID: `icon-${name}`, ...props }, name);
});

jest.mock('@/src/components/ui/atoms', () => {
  const React = require('react');
  const { TouchableOpacity, Text } = require('react-native');
  return {
    Button: ({ title, onPress, children, style, disabled }) =>
      React.createElement(
        TouchableOpacity,
        { onPress, style, disabled, accessibilityRole: 'button' },
        title ? React.createElement(Text, {}, title) : children,
      ),
    TextField: ({ children, variant, style, ...props }) =>
      React.createElement(
        Text,
        { 'data-variant': variant, style, ...props },
        children,
      ),
  };
});

jest.mock('@/src/components/ui/molecules', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity } = require('react-native');
  return {
    AuthHeader: ({ title, subtitle }) =>
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
      ),
    AuthFooterLink: ({ text, linkText, onPress }) =>
      React.createElement(
        TouchableOpacity,
        { onPress, accessibilityRole: 'link', testID: 'footer-link' },
        React.createElement(Text, {}, text),
        React.createElement(Text, {}, linkText),
      ),
    FormField: ({ label }) =>
      React.createElement(
        View,
        { testID: `field-${label}` },
        React.createElement(Text, {}, label),
      ),
    GenderForm: ({ value }) =>
      React.createElement(
        View,
        { testID: 'gender-form' },
        React.createElement(Text, {}, value),
      ),
  };
});

jest.mock('@/src/components/ui/organisms', () => {
  const React = require('react');
  const { View, KeyboardAvoidingView } = require('react-native');
  return {
    AuthLayout: ({ heroContent, children, noCard = false }) =>
      React.createElement(
        KeyboardAvoidingView,
        { testID: 'auth-layout' },
        heroContent,
        noCard
          ? React.createElement(View, {}, children)
          : React.createElement(View, { testID: 'auth-layout-card' }, children),
      ),
  };
});

import RegisterCuidadorScreen from '../index';

describe('RegisterCuidadorScreen — smoke', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(<RegisterCuidadorScreen />);
    expect(getByTestId('auth-layout')).toBeTruthy();
  });

  it('shows the AuthLayout with card', () => {
    const { getByTestId } = render(<RegisterCuidadorScreen />);
    expect(getByTestId('auth-layout-card')).toBeTruthy();
  });

  it('renders hero with title "Registrar cuidador"', () => {
    const { getByTestId } = render(<RegisterCuidadorScreen />);
    expect(getByTestId('auth-header-title').props.children).toBe(
      'Registrar cuidador',
    );
  });

  it('renders core form fields', () => {
    const { getByTestId } = render(<RegisterCuidadorScreen />);
    expect(getByTestId('field-Nombre')).toBeTruthy();
    expect(getByTestId('field-Apellido')).toBeTruthy();
    expect(getByTestId('field-Correo electrónico')).toBeTruthy();
    expect(getByTestId('field-Contraseña')).toBeTruthy();
  });

  it('renders "Crear cuenta" button', () => {
    const { getByText } = render(<RegisterCuidadorScreen />);
    expect(getByText('Crear cuenta')).toBeTruthy();
  });

  it('renders footer link with voseo text', () => {
    const { getByText } = render(<RegisterCuidadorScreen />);
    expect(getByText('¿Ya tenés cuenta?')).toBeTruthy();
    expect(getByText('Iniciar sesión')).toBeTruthy();
  });

  it('wraps content in KeyboardAvoidingView (via AuthLayout)', () => {
    const { UNSAFE_getByType } = render(<RegisterCuidadorScreen />);
    expect(UNSAFE_getByType(KeyboardAvoidingView)).toBeTruthy();
  });
});
