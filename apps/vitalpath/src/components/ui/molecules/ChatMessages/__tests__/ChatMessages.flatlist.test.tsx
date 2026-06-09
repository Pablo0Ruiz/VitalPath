import React from 'react';
import { render } from '@testing-library/react-native';

jest.mock('@/src/hooks/useTheme', () => ({
  useTheme: () => ({
    surfaceElevated: '#FFFFFF',
    border: '#E4E7EF',
    primary600: '#4f6ef7',
  }),
}));

jest.mock('react-native-reanimated', () => ({
  default: {
    View: require('react-native').View,
    createAnimatedComponent: (c: unknown) => c,
  },
  FadeInDown: { delay: () => ({}) },
  createAnimatedComponent: (c: unknown) => c,
}));

jest.mock('@/src/components/ui/atoms', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    MessageItem: () => React.createElement(View, { testID: 'message-item' }),
    MessageItemImage: () =>
      React.createElement(View, { testID: 'message-item-image' }),
  };
});

import { ChatMessages } from '../ChatMessages';

describe('ChatMessages FlatList — PERF-B2-T04', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(
      <ChatMessages messages={[]} isGeminiWriting={false} />,
    );
    expect(toJSON()).not.toBeNull();
  });

  it('FlatList has removeClippedSubviews=false (inverted list)', () => {
    const { UNSAFE_getByType } = render(
      <ChatMessages messages={[]} isGeminiWriting={false} />,
    );
    const { FlatList } = require('react-native');
    const flatList = UNSAFE_getByType(FlatList);
    expect(flatList.props.removeClippedSubviews).toBe(false);
  });

  it('FlatList has initialNumToRender=12', () => {
    const { UNSAFE_getByType } = render(
      <ChatMessages messages={[]} isGeminiWriting={false} />,
    );
    const { FlatList } = require('react-native');
    const flatList = UNSAFE_getByType(FlatList);
    expect(flatList.props.initialNumToRender).toBe(12);
  });
});
