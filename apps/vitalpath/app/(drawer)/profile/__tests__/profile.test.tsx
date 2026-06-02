import React from 'react';
import { render } from '@testing-library/react-native';

jest.mock('@/src/hooks/useTheme', () => ({
  useTheme: () => ({
    background: '#F5F7FC',
    surface: '#FFFFFF',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    border: '#E4E7EF',
    primary600: '#4f6ef7',
    radiusSheet: 24,
  }),
}));

jest.mock('@/src/stores/auth', () => ({
  useAuthStore: () => ({
    user: {
      _id: 'u1',
      name: 'Ana García',
      email: 'ana@test.com',
      role: 'paciente',
      fechaNacimiento: '1990-01-15T00:00:00Z',
      genero: 'femenino',
    },
    clearSession: jest.fn(),
  }),
}));

jest.mock('@repo/api-client', () => ({
  useLogout: () => ({ logout: jest.fn() }),
}));

jest.mock('@/src/adapters/mobileTokenAdapter', () => ({
  mobileTokenAdapter: {},
}));
jest.mock('@/src/routes/routes', () => ({ ROUTES: { LOGIN: '/login' } }));

// ── Organisms ────────────────────────────────────────────────────────────────
jest.mock('@/src/components/ui/organisms', () => {
  const { View } = require('react-native');
  const React = require('react');
  return {
    ScreenLayout: ({ children }: { children: React.ReactNode }) =>
      React.createElement(View, { testID: 'screen-layout' }, children),
  };
});

// ── Atoms ────────────────────────────────────────────────────────────────────
jest.mock('@/src/components/ui/atoms', () => {
  const { View, Text, Pressable } = require('react-native');
  const React = require('react');
  return {
    Button: ({ title, onPress }: { title: string; onPress?: () => void }) =>
      React.createElement(
        Pressable,
        { testID: 'button-' + title, onPress },
        React.createElement(Text, null, title),
      ),
    BackButton: () => React.createElement(View, { testID: 'back-button' }),
    Card: ({ children }: { children: React.ReactNode }) =>
      React.createElement(View, { testID: 'card' }, children),
    ScreenHeader: ({ title }: { title: string }) =>
      React.createElement(Text, { testID: 'screen-header' }, title),
    TextField: ({ children }: { children: React.ReactNode }) =>
      React.createElement(Text, null, children),
    UserAvatar: ({ name }: { name: string }) =>
      React.createElement(
        View,
        { testID: 'user-avatar' },
        React.createElement(Text, null, name),
      ),
  };
});

// ── Molecules ────────────────────────────────────────────────────────────────
jest.mock('@/src/components/ui/molecules', () => {
  const { View, Text } = require('react-native');
  const React = require('react');
  return {
    SettingsRow: ({ label, value }: { label: string; value?: string }) =>
      React.createElement(
        View,
        { testID: 'settings-row-' + label },
        React.createElement(Text, null, label),
        value ? React.createElement(Text, null, value) : null,
      ),
  };
});

import ProfileScreen from '../index';

describe('ProfileScreen (PR5)', () => {
  it('renders ScreenLayout', () => {
    const { getByTestId } = render(<ProfileScreen />);
    expect(getByTestId('screen-layout')).toBeTruthy();
  });

  it('renders UserAvatar with user name', () => {
    const { getByTestId } = render(<ProfileScreen />);
    expect(getByTestId('user-avatar')).toBeTruthy();
  });

  it('renders user name row via SettingsRow', () => {
    const { getByTestId } = render(<ProfileScreen />);
    expect(getByTestId('settings-row-Nombre')).toBeTruthy();
  });

  it('renders email row via SettingsRow', () => {
    const { getByTestId } = render(<ProfileScreen />);
    expect(getByTestId('settings-row-Email')).toBeTruthy();
  });

  it('renders logout button', () => {
    const { getByTestId } = render(<ProfileScreen />);
    expect(getByTestId('button-Cerrar sesión')).toBeTruthy();
  });
});
