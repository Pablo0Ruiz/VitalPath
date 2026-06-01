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

jest.mock('@repo/store', () => ({
  useRegisterStore: () => ({
    draft: {},
    setStep1: jest.fn(),
  }),
}));

jest.mock('@repo/types', () => ({
  step1Schema: { parse: jest.fn() },
}));

jest.mock('@hookform/resolvers/zod', () => ({
  zodResolver: () => jest.fn(),
}));

jest.mock('@expo/vector-icons/Octicons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return ({ name, ...props }) =>
    React.createElement(Text, { testID: `icon-${name}`, ...props }, name);
});

jest.mock('@/src/components/ui/atoms', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity } = require('react-native');
  return {
    Button: ({ title, onPress, children, style, disabled }) =>
      React.createElement(
        TouchableOpacity,
        { onPress, style, disabled, accessibilityRole: 'button' },
        title ? React.createElement(Text, {}, title) : children,
      ),
    ProgressBar: ({ progress, style }) =>
      React.createElement(View, { testID: `progress-${progress}`, style }),
    SocialButton: ({ label }) =>
      React.createElement(
        TouchableOpacity,
        { accessibilityRole: 'button' },
        React.createElement(Text, {}, label),
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
    Divider: ({ text }) =>
      React.createElement(
        View,
        { testID: 'divider' },
        React.createElement(require('react-native').Text, {}, text),
      ),
    FormField: ({ label, helperText, ...props }) =>
      React.createElement(
        View,
        { testID: `field-${label}` },
        React.createElement(require('react-native').Text, {}, label),
      ),
  };
});

jest.mock('@/src/components/ui/organisms', () => {
  const React = require('react');
  const { View, KeyboardAvoidingView, ScrollView } = require('react-native');
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

jest.mock('@/src/routes/routes', () => ({
  ROUTES: { LOGIN: '/login', REGISTER_STEP_2: '/register/step-2' },
}));

import RegisterStep1 from '../index';

describe('RegisterStep1 — smoke', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(<RegisterStep1 />);
    expect(getByTestId('auth-layout')).toBeTruthy();
  });

  it('shows the AuthLayout with card', () => {
    const { getByTestId } = render(<RegisterStep1 />);
    expect(getByTestId('auth-layout-card')).toBeTruthy();
  });

  it('renders hero with title "Crear cuenta"', () => {
    const { getByTestId } = render(<RegisterStep1 />);
    expect(getByTestId('auth-header-title').props.children).toBe(
      'Crear cuenta',
    );
  });

  it('shows a ProgressBar at 33%', () => {
    const { getByTestId } = render(<RegisterStep1 />);
    expect(getByTestId('progress-33')).toBeTruthy();
  });

  it('renders name and lastName form fields', () => {
    const { getByTestId } = render(<RegisterStep1 />);
    expect(getByTestId('field-Nombre completo')).toBeTruthy();
    expect(getByTestId('field-Apellido')).toBeTruthy();
  });

  it('renders "Siguiente" button', () => {
    const { getByText } = render(<RegisterStep1 />);
    expect(getByText('Siguiente')).toBeTruthy();
  });

  it('renders footer link with voseo text', () => {
    const { getByText } = render(<RegisterStep1 />);
    expect(getByText('¿Ya tenés cuenta?')).toBeTruthy();
    expect(getByText('Iniciar sesión')).toBeTruthy();
  });

  it('wraps content in KeyboardAvoidingView (via AuthLayout)', () => {
    const { UNSAFE_getByType } = render(<RegisterStep1 />);
    expect(UNSAFE_getByType(KeyboardAvoidingView)).toBeTruthy();
  });
});
