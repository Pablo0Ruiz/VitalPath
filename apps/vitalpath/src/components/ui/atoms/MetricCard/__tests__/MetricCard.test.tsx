import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

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
    secondary500: '#14B8A6',
    success: '#10B981',
    error: '#EF4444',
    fontSizeTitle: 24,
    fontSizeDisplay: 32,
    fontSizeBody: 15,
    fontSizeCaption: 13,
    fontSizeLabel: 11,
    radiusCard: 16,
    minTouchTarget: 44,
  }),
}));

// ── react-native-reanimated mock ──────────────────────────────────────────────
// Extends the global setup mock with useReducedMotion and FadeInDown.
jest.mock('react-native-reanimated', () => ({
  default: {
    View: require('react-native').View,
    Text: require('react-native').Text,
    Image: require('react-native').Image,
    ScrollView: require('react-native').ScrollView,
    FlatList: require('react-native').FlatList,
    createAnimatedComponent: (c: unknown) => c,
  },
  useReducedMotion: () => false,
  FadeInDown: {
    delay: () => ({
      springify: () => ({
        damping: () => ({}),
      }),
    }),
  },
  createAnimatedComponent: (c: unknown) => c,
  useSharedValue: (init: unknown) => ({ value: init }),
  useAnimatedStyle: (fn: () => unknown) => fn(),
  withTiming: (val: unknown) => val,
  withSpring: (val: unknown) => val,
  withDelay: (_: unknown, val: unknown) => val,
  withSequence: (...vals: unknown[]) => vals[vals.length - 1],
  withRepeat: (val: unknown) => val,
  cancelAnimation: jest.fn(),
  runOnJS: (fn: unknown) => fn,
  runOnUI: (fn: unknown) => fn,
  interpolate: jest.fn((val: unknown) => val),
}));

// ── useColorScheme mock ───────────────────────────────────────────────────────
jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
  default: () => 'light',
}));

import MetricCard from '../MetricCard';

describe('MetricCard', () => {
  it('value=null renders "Sin datos aún" text', () => {
    const { getByText } = render(
      <MetricCard icon={null} label="PASOS" value={null} />,
    );
    expect(getByText('Sin datos aún')).toBeTruthy();
  });

  it('value=null with onConfigure prop renders a "Configurar" touchable', () => {
    const mockConfigure = jest.fn();
    const { getByText } = render(
      <MetricCard
        icon={null}
        label="PASOS"
        value={null}
        onConfigure={mockConfigure}
      />,
    );
    const btn = getByText('Configurar');
    expect(btn).toBeTruthy();
    fireEvent.press(btn);
    expect(mockConfigure).toHaveBeenCalledTimes(1);
  });

  it('value="85%" renders the value string', () => {
    const { getByText } = render(
      <MetricCard icon={null} label="ADHERENCIA" value="85%" />,
    );
    expect(getByText('85%')).toBeTruthy();
  });

  it('trend="up" renders an up-trend indicator', () => {
    const { getByTestId } = render(
      <MetricCard icon={null} label="ADHERENCIA" value="85%" trend="up" />,
    );
    expect(getByTestId('metric-card-trend-up')).toBeTruthy();
  });

  it('renders a label', () => {
    const { getByText } = render(
      <MetricCard icon={null} label="PRÓXIMA CITA" value="Lunes" />,
    );
    expect(getByText('PRÓXIMA CITA')).toBeTruthy();
  });

  it('ctaLabel overrides "Configurar" default', () => {
    const { getByText } = render(
      <MetricCard
        icon={null}
        label="PASOS"
        value={null}
        onConfigure={jest.fn()}
        ctaLabel="Activar"
      />,
    );
    expect(getByText('Activar')).toBeTruthy();
  });
});
