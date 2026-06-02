import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

jest.mock('@/src/hooks/useTheme', () => ({
  useTheme: () => ({
    background: '#F5F7FC',
    surface: '#FFFFFF',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    border: '#E4E7EF',
    primary500: '#6480f8',
    primary600: '#4f6ef7',
    radiusSheet: 24,
  }),
}));

let mockIsSeniorUI = false;
const mockSetIsSeniorUI = jest.fn(val => {
  mockIsSeniorUI = val;
});

jest.mock('@/src/stores/seniorUI.store', () => ({
  useSeniorUIStore: () => ({
    isSeniorUI: mockIsSeniorUI,
    setIsSeniorUI: mockSetIsSeniorUI,
  }),
}));

jest.mock('@/src/components/ui/organisms', () => {
  const { View } = require('react-native');
  const React = require('react');
  return {
    ScreenLayout: ({ children }: { children: React.ReactNode }) =>
      React.createElement(View, { testID: 'screen-layout' }, children),
  };
});

jest.mock('@/src/components/ui/atoms', () => {
  const { View, Text } = require('react-native');
  const React = require('react');
  return {
    BackButton: () => React.createElement(View, { testID: 'back-button' }),
    Card: ({ children }: { children: React.ReactNode }) =>
      React.createElement(View, { testID: 'card' }, children),
    ScreenHeader: ({ title }: { title: string }) =>
      React.createElement(Text, { testID: 'screen-header' }, title),
    TextField: ({ children }: { children: React.ReactNode }) =>
      React.createElement(Text, null, children),
  };
});

import SettingsScreen from '../index';

describe('SettingsScreen (PR5)', () => {
  beforeEach(() => {
    mockIsSeniorUI = false;
    mockSetIsSeniorUI.mockClear();
  });

  it('renders ScreenLayout', () => {
    const { getByTestId } = render(<SettingsScreen />);
    expect(getByTestId('screen-layout')).toBeTruthy();
  });

  it('renders senior mode label', () => {
    const { getByText } = render(<SettingsScreen />);
    expect(getByText('Modo accesible (Senior)')).toBeTruthy();
  });

  it('renders senior mode description', () => {
    const { getByText } = render(<SettingsScreen />);
    expect(getByText('Texto y botones más grandes')).toBeTruthy();
  });

  it('renders Switch for senior mode', () => {
    const { UNSAFE_getByType } = render(<SettingsScreen />);
    const { Switch } = require('react-native');
    expect(UNSAFE_getByType(Switch)).toBeTruthy();
  });

  it('renders version text', () => {
    const { getByText } = render(<SettingsScreen />);
    expect(getByText('VitalPath v1.0.0')).toBeTruthy();
  });
});
