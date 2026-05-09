import {
  Modal,
  StyleSheet,
  View,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { TextField } from '@/src/components/ui/atoms';
import { useTheme } from '@/src/hooks/useTheme';
import { useVoiceAssistant } from '@/src/hooks/useVoiceAssistant';
import { useChatContextStore } from '@repo/store';

interface VoiceAssistantModalProps {
  visible: boolean;
  onClose: () => void;
  chatId: string;
}

const VoiceAssistantModal = ({
  visible,
  onClose,
  chatId,
}: VoiceAssistantModalProps) => {
  const t = useTheme();
  const addVoiceMessage = useChatContextStore(state => state.addVoiceMessage);

  const {
    isRecording,
    isProcessing,
    isSpeaking,
    lastReply,
    startRecording,
    processVoiceCommand,
    stopSpeaking,
  } = useVoiceAssistant({
    chatId,
    onSuccess: (transcript, replyText) => {
      addVoiceMessage(transcript, replyText);
    },
  });

  const handlePress = () => {
    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    if (isRecording) {
      processVoiceCommand();
    } else {
      startRecording();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={[s.backdrop, { backgroundColor: 'rgba(0,0,0,0.4)' }]}>
        <Pressable style={s.overlay} onPress={onClose} />
      </View>

      <View style={s.content}>
        <LinearGradient
          colors={[t.surfaceElevated, t.background]}
          style={[s.card, { borderColor: t.border }]}
        >
          <Pressable style={s.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={t.textSecondary} />
          </Pressable>

          <View style={s.avatarContainer}>
            <LinearGradient
              colors={[t.primary500, t.primary700]}
              style={s.avatar}
            >
              <Ionicons name="chatbubbles" size={40} color="white" />
            </LinearGradient>
            {(isRecording || isSpeaking) && (
              <View style={[s.pulse, { borderColor: t.primary500 }]} />
            )}
          </View>

          <TextField
            variant="title"
            style={[s.title, { color: t.textPrimary }]}
          >
            {isRecording
              ? 'Te escucho...'
              : isProcessing
                ? 'Procesando...'
                : isSpeaking
                  ? 'VitalPath AI'
                  : '¿En qué puedo ayudarte?'}
          </TextField>

          {lastReply && !isRecording && !isProcessing && (
            <TextField
              variant="subtitle"
              style={[s.reply, { color: t.textSecondary }]}
            >
              {lastReply}
            </TextField>
          )}

          <View style={s.controls}>
            <Pressable
              onPress={handlePress}
              style={({ pressed }) => [
                s.mainButton,
                {
                  backgroundColor: isRecording ? t.error : t.primary600,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              {isProcessing ? (
                <ActivityIndicator color="white" />
              ) : (
                <Ionicons
                  name={
                    isSpeaking ? 'stop' : isRecording ? 'stop-circle' : 'mic'
                  }
                  size={32}
                  color="white"
                />
              )}
            </Pressable>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
};

export default VoiceAssistantModal;

const s = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject },
  overlay: { flex: 1 },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    borderRadius: 32,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
  },
  avatarContainer: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  pulse: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    opacity: 0.5,
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
  },
  reply: {
    textAlign: 'center',
    marginBottom: 20,
    maxHeight: 150,
  },
  controls: {
    marginTop: 20,
  },
  mainButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
