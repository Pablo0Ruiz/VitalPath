import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

jest.mock('@/src/hooks/useTheme', () => ({
  useTheme: () => ({
    background: '#F5F7FC',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    border: '#E4E7EF',
    primary500: '#6480f8',
    primary600: '#4f6ef7',
    primary700: '#3a57e0',
    warning: '#F59E0B',
  }),
}));

jest.mock('@repo/store', () => ({
  useChatContextStore: <T,>(
    selector: (state: { addVoiceMessage: (...args: any[]) => void }) => T,
  ) => selector({ addVoiceMessage: jest.fn() }),
}));

let mockIsRecording = false;
let mockIsProcessing = false;
let mockIsSpeaking = false;
const mockStartRecording = jest.fn();
const mockProcessVoiceCommand = jest.fn();
const mockStopSpeaking = jest.fn();

jest.mock('@/src/hooks/useVoiceAssistant', () => ({
  useVoiceAssistant: () => ({
    isRecording: mockIsRecording,
    isProcessing: mockIsProcessing,
    isSpeaking: mockIsSpeaking,
    lastReply: null,
    startRecording: mockStartRecording,
    processVoiceCommand: mockProcessVoiceCommand,
    stopSpeaking: mockStopSpeaking,
  }),
}));

jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native');
  const AnimatedDefault = {
    View,
    createAnimatedComponent: (c: unknown) => c,
  };
  return {
    __esModule: true,
    default: AnimatedDefault,
    ...AnimatedDefault,
    useSharedValue: (init: unknown) => ({ value: init }),
    useAnimatedStyle: (fn: () => unknown) => fn(),
    withTiming: (val: unknown) => val,
    withSequence: (...vals: unknown[]) => vals[vals.length - 1],
    withRepeat: (val: unknown) => val,
    cancelAnimation: jest.fn(),
    createAnimatedComponent: (c: unknown) => c,
    interpolate: jest.fn((val: unknown) => val),
    Easing: {
      inOut: jest.fn(() => jest.fn()),
      ease: jest.fn(),
    },
  };
});

jest.mock('@/src/components/ui/atoms', () => {
  const { Text } = require('react-native');
  const React = require('react');
  return {
    TextField: ({ children }: { children?: React.ReactNode }) =>
      React.createElement(Text, null, children),
  };
});

import VoiceAssistantModal from '../VoiceAssistantModal';

const baseProps = {
  visible: true,
  onClose: jest.fn(),
  chatId: 'chat-1',
};

describe('VoiceAssistantModal (PR5)', () => {
  beforeEach(() => {
    mockIsRecording = false;
    mockIsProcessing = false;
    mockIsSpeaking = false;
    jest.clearAllMocks();
  });

  it('renders when visible=true', () => {
    const { getByText } = render(<VoiceAssistantModal {...baseProps} />);
    expect(getByText('¿En qué puedo ayudarte?')).toBeTruthy();
  });

  it('shows recording state text when isRecording=true', () => {
    mockIsRecording = true;
    const { getByText } = render(<VoiceAssistantModal {...baseProps} />);
    expect(getByText('Te escucho...')).toBeTruthy();
  });

  it('shows processing state text when isProcessing=true', () => {
    mockIsProcessing = true;
    const { getByText } = render(<VoiceAssistantModal {...baseProps} />);
    expect(getByText('Procesando...')).toBeTruthy();
  });

  it('calls onClose when close is pressed', () => {
    const onClose = jest.fn();
    const { getAllByRole } = render(
      <VoiceAssistantModal {...baseProps} onClose={onClose} />,
    );

    expect(onClose).not.toHaveBeenCalled();
  });

  it('pressing main button calls startRecording when idle', () => {
    const { getByTestId } = render(<VoiceAssistantModal {...baseProps} />);
    const btn = getByTestId('voice-main-button');
    fireEvent.press(btn);
    expect(mockStartRecording).toHaveBeenCalledTimes(1);
  });

  it('pressing main button calls processVoiceCommand when recording', () => {
    mockIsRecording = true;
    const { getByTestId } = render(<VoiceAssistantModal {...baseProps} />);
    const btn = getByTestId('voice-main-button');
    fireEvent.press(btn);
    expect(mockProcessVoiceCommand).toHaveBeenCalledTimes(1);
  });
});
