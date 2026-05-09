import { useState, useEffect } from 'react';
import * as Speech from 'expo-speech';
import {
  useAudioRecorder,
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorderState,
} from 'expo-audio';

import { useVoiceChat } from '@repo/api-client';

type Options = {
  chatId: string;
  language?: string;
  onSuccess?: (transcript: string, replyText: string) => void;
};

export function useVoiceAssistant({
  chatId,
  language = 'es-AR',
  onSuccess,
}: Options) {
  const { mutateAsync: sendVoiceAudio, isPending: isProcessing } =
    useVoiceChat();
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);

  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastTranscript, setLastTranscript] = useState<string>('');
  const [lastReply, setLastReply] = useState<string>('');

  useEffect(() => {
    setIsRecording(recorderState.isRecording);
  }, [recorderState.isRecording]);

  const startRecording = async () => {
    try {
      await Speech.stop();
      setIsSpeaking(false);

      const permission = await AudioModule.requestRecordingPermissionsAsync();
      if (!permission.granted) {
        throw new Error('No hay permiso de micrófono');
      }

      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });

      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
    } catch (err) {
      console.error('startRecording error', err);
    }
  };

  const stopRecordingAndSend = async () => {
    try {
      if (!recorderState.isRecording) return null;

      await audioRecorder.stop();
      const uri = audioRecorder.uri;

      console.log('[useVoiceAssistant] stopRecordingAndSend:', {
        uri,
        chatId,
      });

      if (!uri) {
        console.warn(
          '[useVoiceAssistant] No hay URI disponible después de grabar',
        );
        return null;
      }

      const formData = new FormData();
      const normalizedUri = uri.startsWith('file://') ? uri : `file://${uri}`;

      formData.append('file', {
        uri: normalizedUri,
        name: 'voice.m4a',
        type: 'audio/m4a',
      } as any);
      formData.append('chatId', chatId);

      const data = await sendVoiceAudio(formData);

      setLastTranscript(data.transcript);
      setLastReply(data.replyText);

      if (onSuccess) {
        onSuccess(data.transcript, data.replyText);
      }

      return data;
    } catch (err) {
      console.error('stopRecording error', err);
      return null;
    }
  };

  const speakReply = async (text: string) => {
    if (!text) return;

    try {
      console.log('[useVoiceAssistant] Intentando hablar:', text);
      await Speech.stop();

      await setAudioModeAsync({
        allowsRecording: false,
        playsInSilentMode: true,
      });

      setIsSpeaking(true);

      Speech.speak(text, {
        language,
        rate: 0.95,
        pitch: 1.0,
        onDone: () => {
          console.log('[useVoiceAssistant] Speech finalizado');
          setIsSpeaking(false);
        },
        onStopped: () => {
          console.log('[useVoiceAssistant] Speech detenido');
          setIsSpeaking(false);
        },
        onError: error => {
          console.error('[useVoiceAssistant] Speech error:', error);
          setIsSpeaking(false);
        },
      });
    } catch (err) {
      console.error('[useVoiceAssistant] Error en speakReply:', err);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = async () => {
    await Speech.stop();
    setIsSpeaking(false);
  };

  const processVoiceCommand = async () => {
    const result = await stopRecordingAndSend();
    if (result?.replyText) {
      await speakReply(result.replyText);
    }
  };

  return {
    isRecording,
    isProcessing,
    isSpeaking,
    lastTranscript,
    lastReply,
    startRecording,
    stopRecordingAndSend,
    processVoiceCommand,
    speakReply,
    stopSpeaking,
  };
}
