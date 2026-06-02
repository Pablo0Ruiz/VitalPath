import React from 'react';
import { render } from '@testing-library/react-native';

jest.mock('@/src/hooks/useTheme', () => ({
  useTheme: () => ({
    primary600: '#4f6ef7',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    border: '#E4E7EF',
  }),
}));

jest.mock('react-native-reanimated', () => ({
  default: {
    View: require('react-native').View,
    createAnimatedComponent: (c: unknown) => c,
  },
  useSharedValue: (init: unknown) => ({ value: init }),
  useAnimatedStyle: (fn: () => unknown) => fn(),
  withTiming: (val: unknown) => val,
  withSequence: (...vals: unknown[]) => vals[vals.length - 1],
  withRepeat: (val: unknown) => val,
  withDelay: (_: unknown, val: unknown) => val,
  cancelAnimation: jest.fn(),
  createAnimatedComponent: (c: unknown) => c,
  useReducedMotion: () => false,
}));

jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
  default: () => 'light',
}));

import ThinkingIndicator from '../ThinkingIndicator';

describe('ThinkingIndicator', () => {
  it('renders exactly 3 dots', () => {
    const { getAllByTestId } = render(<ThinkingIndicator />);
    expect(getAllByTestId(/^thinking-dot-/).length).toBe(3);
  });

  it('is accessible via testID="thinking-indicator"', () => {
    const { getByTestId } = render(<ThinkingIndicator />);
    expect(getByTestId('thinking-indicator')).toBeTruthy();
  });

  it('with useReducedMotion=true renders static dots (no animation crash)', () => {
    // Override to simulate reduced motion
    const Reanimated = require('react-native-reanimated');
    const originalUseReducedMotion = Reanimated.useReducedMotion;
    Reanimated.useReducedMotion = () => true;

    const { getAllByTestId } = render(<ThinkingIndicator />);
    expect(getAllByTestId(/^thinking-dot-/).length).toBe(3);

    Reanimated.useReducedMotion = originalUseReducedMotion;
  });
});
