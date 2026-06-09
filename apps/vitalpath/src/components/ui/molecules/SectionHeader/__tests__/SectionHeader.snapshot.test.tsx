import React from 'react';
import { render } from '@testing-library/react-native';

jest.mock('@/src/hooks/useTheme', () => ({
  useTheme: () => ({
    textPrimary: '#111827',
    primary700: '#3a57e0',
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

import SectionHeader from '../SectionHeader';

describe('SectionHeader — snapshot baseline (PERF-B0-T01)', () => {
  it('renders title-only and matches snapshot', () => {
    const { toJSON } = render(<SectionHeader title="Medicamentos" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders with link and matches snapshot', () => {
    const { toJSON } = render(
      <SectionHeader
        title="Citas"
        linkLabel="Ver todas"
        onLinkPress={() => {}}
      />,
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
