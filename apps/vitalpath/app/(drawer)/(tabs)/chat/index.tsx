import { StyleSheet, View, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Octicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { Button, TextField } from '@/src/components/ui/atoms';
import { ChatMessages } from '@/src/components/ui/molecules/ChatMessages/ChatMessages';
import { ChatComposer } from '@/src/components/ui/molecules';
import { useChatContextStore } from '@repo/store';
import { getChatStream } from '@/src/core/actions/chat-stream.actions';
import { appointmentKeys } from '@repo/api-client';
import { useTheme } from '@/src/hooks/useTheme';
import { ROUTES } from '@/src/routes/routes';

type Attachment = {
  uri: string;
  fileName?: string | null;
  type?: string | null;
  size?: number;
};

const Chat = () => {
  const t = useTheme();
  const queryClient = useQueryClient();
  const messages = useChatContextStore(state => state.messages);
  const addMessage = useChatContextStore(state => state.addMessage);
  const geminiWriting = useChatContextStore(state => state.geminiWriting);

  const handleSendMessage = async (
    prompt: string,
    attachments: Attachment[],
  ) => {
    await addMessage(prompt, attachments, getChatStream);
    queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
  };

  const SUGGESTIONS = [
    '¿Cómo leo mis análisis?',
    'Próxima vacuna',
    'Tips de sueño',
  ];

  return (
    <SafeAreaView
      style={[s.container, { backgroundColor: t.background }]}
      edges={['top']}
    >
      <View
        style={[
          s.header,
          { backgroundColor: t.background, justifyContent: 'center' },
        ]}
      >
        <Button
          onPress={() => router.replace(ROUTES.HOME)}
          variant="ghost"
          style={{
            position: 'absolute',
            left: 10,
            zIndex: 20,
          }}
        >
          <Octicons name="chevron-left" size={24} color={t.textPrimary} />
        </Button>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <LinearGradient
            colors={[t.primary600, t.primary700]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[s.avatar, s.shadow]}
          >
            <Octicons name="dependabot" size={20} color="white" />
          </LinearGradient>
          <View>
            <TextField
              variant="body"
              style={[s.title, { color: t.textPrimary }]}
            >
              VitalPath AI
            </TextField>
            <View style={s.statusRow}>
              <View style={[s.onlineDot, { backgroundColor: t.success }]} />
              <TextField
                variant="caption"
                style={[s.statusText, { color: t.textSecondary }]}
              >
                En línea
              </TextField>
            </View>
          </View>
        </View>
      </View>

      <View style={s.chatContent}>
        <ChatMessages messages={messages} isGeminiWriting={geminiWriting} />
        {messages.length <= 1 && !geminiWriting && (
          <View style={s.suggestionsWrapper}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.suggestionsScroll}
            >
              {SUGGESTIONS.map((sug, i) => (
                <Pressable
                  key={i}
                  onPress={() => handleSendMessage(sug, [])}
                  style={({ pressed }) => [
                    s.suggestionPill,
                    {
                      backgroundColor: t.neutral100,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <TextField
                    variant="caption"
                    style={[s.suggestionText, { color: t.textPrimary }]}
                  >
                    {sug}
                  </TextField>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
      <ChatComposer onSendMessage={handleSendMessage} />
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 16,
    zIndex: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: { fontWeight: '700', fontSize: 16, textAlign: 'left' },
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  onlineDot: { width: 6, height: 6, borderRadius: 3, marginRight: 4 },
  statusText: { fontSize: 12, textAlign: 'left' },
  chatContent: { flex: 1 },
  suggestionsWrapper: { position: 'absolute', bottom: 8, width: '100%' },
  suggestionsScroll: { paddingHorizontal: 20, gap: 10 },
  suggestionPill: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 99,
  },
  suggestionText: { fontWeight: '700', fontSize: 14 },
});

export default Chat;
