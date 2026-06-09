import React from 'react';
import { render } from '@testing-library/react-native';

jest.mock('@/src/hooks/useTheme', () => ({
  useTheme: () => ({
    background: '#F5F7FC',
    surface: '#FFFFFF',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    primary50: '#eef1fe',
    primary100: '#dde3fd',
    primary200: '#bbc7fb',
    primary700: '#3a57e0',
    neutral100: '#F4F4F5',
    neutral600: '#52525B',
    error: '#EF4444',
    errorLight: '#FEE2E2',
    success: '#10B981',
  }),
}));

jest.mock('@/src/components/ui/atoms', () => {
  const { Text, Pressable } = require('react-native');
  const React = require('react');
  return {
    Button: ({
      children,
      onPress,
      style,
    }: {
      children?: React.ReactNode;
      onPress?: () => void;
      style?: object;
    }) => React.createElement(Pressable, { onPress, style }, children),
    TextField: ({
      children,
      style,
    }: {
      children?: React.ReactNode;
      style?: object;
    }) => React.createElement(Text, { style }, children),
  };
});

import MedicationRow from '../MedicationRow';

describe('MedicationRow — snapshot baseline (PERF-B0-T01)', () => {
  it('renders pending medication and matches snapshot', () => {
    const { toJSON } = render(
      <MedicationRow name="Metformin" time="08:00" isDone={false} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders completed medication and matches snapshot', () => {
    const { toJSON } = render(
      <MedicationRow name="Atenolol" time="20:00" isDone={true} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
