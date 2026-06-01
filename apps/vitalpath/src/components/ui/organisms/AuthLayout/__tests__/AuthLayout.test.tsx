import React from 'react';
import { Text, Platform } from 'react-native';
import { render } from '@testing-library/react-native';
import { AuthLayout } from '../AuthLayout';

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
    fontSizeTitle: 24,
    fontSizeBody: 15,
    fontSizeCaption: 13,
    fontSizeLabel: 11,
    radiusSheet: 24,
    minTouchTarget: 44,
  }),
}));

// ── expo-linear-gradient mock ─────────────────────────────────────────────────
jest.mock('expo-linear-gradient', () => {
  const { View } = require('react-native');
  const React = require('react');
  return {
    LinearGradient: ({ children, ...props }: React.PropsWithChildren<object>) =>
      React.createElement(
        View,
        { testID: 'linear-gradient', ...props },
        children,
      ),
  };
});

// ── useColorScheme mock ───────────────────────────────────────────────────────
jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
  default: () => 'light',
}));

// ── react-native-safe-area-context mock ──────────────────────────────────────
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

describe('AuthLayout', () => {
  it('renders heroContent slot', () => {
    const { getByTestId } = render(
      <AuthLayout heroContent={<Text testID="hero-content">Hero</Text>}>
        <Text>Children</Text>
      </AuthLayout>,
    );
    expect(getByTestId('hero-content')).toBeTruthy();
  });

  it('renders children inside card when noCard is false (default)', () => {
    const { getByTestId } = render(
      <AuthLayout heroContent={<Text>Hero</Text>}>
        <Text testID="card-child">Form content</Text>
      </AuthLayout>,
    );
    const child = getByTestId('card-child');
    expect(child).toBeTruthy();
  });

  it('renders children without card wrapper when noCard=true', () => {
    const { getByTestId, queryByTestId } = render(
      <AuthLayout heroContent={<Text>Hero</Text>} noCard={true}>
        <Text testID="no-card-child">No card</Text>
      </AuthLayout>,
    );
    expect(getByTestId('no-card-child')).toBeTruthy();
    // card testID should not exist when noCard=true
    expect(queryByTestId('auth-layout-card')).toBeNull();
  });

  it('renders card wrapper when noCard is false', () => {
    const { getByTestId } = render(
      <AuthLayout heroContent={<Text>Hero</Text>} noCard={false}>
        <Text>Child</Text>
      </AuthLayout>,
    );
    expect(getByTestId('auth-layout-card')).toBeTruthy();
  });

  it('KeyboardAvoidingView has behavior="padding" on iOS', () => {
    const originalOS = Platform.OS;
    (Platform as unknown as { OS: string }).OS = 'ios';

    const { UNSAFE_getByType } = render(
      <AuthLayout heroContent={<Text>Hero</Text>}>
        <Text>Child</Text>
      </AuthLayout>,
    );

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { KeyboardAvoidingView } = require('react-native');
    const kav = UNSAFE_getByType(KeyboardAvoidingView);
    expect(kav.props.behavior).toBe('padding');

    (Platform as unknown as { OS: string }).OS = originalOS;
  });
});
