import React from 'react';
import { render } from '@testing-library/react-native';

jest.mock('@/src/hooks/useTheme', () => ({
  useTheme: () => ({
    background: '#F5F7FC',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    border: '#E4E7EF',
    primary600: '#4f6ef7',
    secondary500: '#14B8A6',
    success: '#10B981',
    error: '#EF4444',
    fontSizeBody: 15,
    fontSizeCaption: 13,
  }),
}));

jest.mock('react-native-reanimated', () => ({
  default: {
    View: require('react-native').View,
    createAnimatedComponent: (c: unknown) => c,
  },
  useReducedMotion: () => false,
  FadeInDown: {
    delay: () => ({ springify: () => ({ damping: () => ({}) }) }),
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
  interpolate: jest.fn((val: unknown) => val),
}));

jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
  default: () => 'light',
}));

import MetricCard from '../MetricCard';

describe('MetricCard — snapshot baseline (PERF-B0-T01)', () => {
  it('renders with a value and matches snapshot', () => {
    const { toJSON } = render(
      <MetricCard icon={null} label="PASOS" value="8,000" unit="steps" />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders with null value and matches snapshot', () => {
    const { toJSON } = render(
      <MetricCard icon={null} label="ADHERENCIA" value={null} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
