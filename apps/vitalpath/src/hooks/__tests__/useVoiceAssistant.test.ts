import { renderHook, act } from '@testing-library/react-native';
import { useVoiceAssistant } from '../useVoiceAssistant';
import * as Speech from 'expo-speech';
import {
  AudioModule,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import { useVoiceChat } from '@repo/api-client';

// --- Mocks ---
jest.mock('expo-speech', () => ({
  stop: jest.fn().mockResolvedValue(undefined),
  speak: jest.fn(),
}));

jest.mock('expo-audio', () => ({
  AudioModule: {
    requestRecordingPermissionsAsync: jest
      .fn()
      .mockResolvedValue({ granted: true }),
  },
  setAudioModeAsync: jest.fn().mockResolvedValue(undefined),
  RecordingPresets: { HIGH_QUALITY: 'HIGH_QUALITY' },
  useAudioRecorder: jest.fn(),
  useAudioRecorderState: jest.fn(),
}));

jest.mock('@repo/api-client', () => ({
  useVoiceChat: jest.fn(),
}));

// Setup fake FormData
global.FormData = class FormData {
  append = jest.fn();
} as any;

describe('useVoiceAssistant Hook', () => {
  let mockMutateAsync: jest.Mock;
  let mockRecorder: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockMutateAsync = jest.fn().mockResolvedValue({
      transcript: 'Hello',
      replyText: 'Hi there',
    });

    (useVoiceChat as jest.Mock).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    });

    mockRecorder = {
      prepareToRecordAsync: jest.fn().mockResolvedValue(undefined),
      record: jest.fn(),
      stop: jest.fn().mockResolvedValue(undefined),
      uri: 'file://test-audio.m4a',
    };
    (useAudioRecorder as jest.Mock).mockReturnValue(mockRecorder);

    (useAudioRecorderState as jest.Mock).mockReturnValue({
      isRecording: false,
    });
  });

  it('should initialize with default states', () => {
    const { result } = renderHook(() =>
      useVoiceAssistant({ chatId: 'chat-1' }),
    );

    expect(result.current.isRecording).toBe(false);
    expect(result.current.isSpeaking).toBe(false);
    expect(result.current.lastTranscript).toBe('');
    expect(result.current.lastReply).toBe('');
  });

  it('should request permissions and start recording', async () => {
    const { result } = renderHook(() =>
      useVoiceAssistant({ chatId: 'chat-1' }),
    );

    await act(async () => {
      await result.current.startRecording();
    });

    expect(Speech.stop).toHaveBeenCalled();
    expect(AudioModule.requestRecordingPermissionsAsync).toHaveBeenCalled();
    expect(setAudioModeAsync).toHaveBeenCalled();
    expect(mockRecorder.prepareToRecordAsync).toHaveBeenCalled();
    expect(mockRecorder.record).toHaveBeenCalled();
  });

  it('should not start recording if permission is denied', async () => {
    (
      AudioModule.requestRecordingPermissionsAsync as jest.Mock
    ).mockResolvedValueOnce({ granted: false });
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const { result } = renderHook(() =>
      useVoiceAssistant({ chatId: 'chat-1' }),
    );

    await act(async () => {
      await result.current.startRecording();
    });

    expect(mockRecorder.record).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  it('should stop recording, send audio, and update state', async () => {
    // We simulate that we are currently recording
    (useAudioRecorderState as jest.Mock).mockReturnValue({ isRecording: true });

    const onSuccessMock = jest.fn();
    const { result } = renderHook(() =>
      useVoiceAssistant({ chatId: 'chat-1', onSuccess: onSuccessMock }),
    );

    const data = await act(async () => {
      return await result.current.stopRecordingAndSend();
    });

    expect(mockRecorder.stop).toHaveBeenCalled();
    expect(mockMutateAsync).toHaveBeenCalled();
    expect(result.current.lastTranscript).toBe('Hello');
    expect(result.current.lastReply).toBe('Hi there');
    expect(onSuccessMock).toHaveBeenCalledWith('Hello', 'Hi there');
    expect(data).toEqual({ transcript: 'Hello', replyText: 'Hi there' });
  });

  it('should return null if trying to stop when not recording', async () => {
    (useAudioRecorderState as jest.Mock).mockReturnValue({
      isRecording: false,
    });

    const { result } = renderHook(() =>
      useVoiceAssistant({ chatId: 'chat-1' }),
    );

    const data = await act(async () => {
      return await result.current.stopRecordingAndSend();
    });

    expect(data).toBeNull();
    expect(mockRecorder.stop).not.toHaveBeenCalled();
  });

  it('should speak the reply text', async () => {
    const { result } = renderHook(() =>
      useVoiceAssistant({ chatId: 'chat-1' }),
    );

    await act(async () => {
      await result.current.speakReply('Hola mundo');
    });

    expect(Speech.stop).toHaveBeenCalled();
    expect(Speech.speak).toHaveBeenCalledWith('Hola mundo', expect.any(Object));
  });
});
