import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

// ── Theme ────────────────────────────────────────────────────────────────────
jest.mock('@/src/hooks/useTheme', () => ({
  useTheme: () => ({
    background: '#F6F4F9',
    surface: '#FDFCFF',
    surfaceElevated: '#FFFFFF',
    textPrimary: '#1C1030',
    textSecondary: '#5C5670',
    textInverse: '#FFFFFF',
    border: '#E5DEED',
    primary50: '#F5F0FB',
    primary100: '#EBE1F7',
    primary200: '#D7C3EF',
    primary500: '#8B5DC8',
    primary600: '#4B2067',
    primary700: '#3A1852',
    primary900: '#1E0C2B',
    neutral100: '#F4F4F5',
    error: '#FF4D6A',
    white: '#FFFFFF',
    black: '#000000',
    fontSizeTitle: 28,
    fontSizeBody: 14,
    fontSizeCaption: 12,
    fontSizeLabel: 11,
    minTouchTarget: 44,
  }),
}));

// ── API client ───────────────────────────────────────────────────────────────
jest.mock('@repo/api-client', () => ({
  useConversations: () => ({ data: [], isLoading: false, refetch: jest.fn() }),
}));

// ── ConversationCard (not relevant to the footer behaviors under test) ────────
jest.mock(
  '@/src/components/ui/molecules/ConversationCard/ConversationCard',
  () => {
    const { View } = require('react-native');
    const React = require('react');
    return {
      ConversationCard: () =>
        React.createElement(View, { testID: 'conversation-card' }),
    };
  },
);

// jest.setup.js already mocks react-native-safe-area-context globally:
//   useSafeAreaInsets returns { top: 0, right: 0, bottom: 0, left: 0 }
// We override it per-test when needed.

import ChatHistory from '../ChatHistory';

describe('ChatHistory — footer "Nueva Consulta" button', () => {
  it('renders the "Nueva Consulta" button', () => {
    const { getByText } = render(
      <ChatHistory onSelectConversation={jest.fn()} onNewChat={jest.fn()} />,
    );
    expect(getByText('Nueva Consulta')).toBeTruthy();
  });

  it('calls onNewChat when "Nueva Consulta" is pressed', () => {
    const onNewChat = jest.fn();
    const { getByText } = render(
      <ChatHistory onSelectConversation={jest.fn()} onNewChat={onNewChat} />,
    );
    fireEvent.press(getByText('Nueva Consulta'));
    expect(onNewChat).toHaveBeenCalledTimes(1);
  });

  it('renders the chat-footer testID once useSafeAreaInsets is consumed', () => {
    // This test will FAIL until testID="chat-footer" is added in Task 3.2
    const { getByTestId } = render(
      <ChatHistory onSelectConversation={jest.fn()} onNewChat={jest.fn()} />,
    );
    expect(getByTestId('chat-footer')).toBeTruthy();
  });
});
