import { FlatList, View, StyleSheet, ActivityIndicator } from 'react-native';
import { ConversationCard } from '../../molecules/ConversationCard';
import { TextField, Button } from '../../atoms';
import { useConversations } from '@repo/api-client';
import { useTheme } from '@/src/hooks/useTheme';

interface ChatHistoryProps {
  onSelectConversation: (chatId: string) => void;
  onNewChat: () => void;
}

const ChatHistory = ({ onSelectConversation, onNewChat }: ChatHistoryProps) => {
  const { data: conversations, isLoading, refetch } = useConversations();
  const t = useTheme();

  if (isLoading) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color={t.primary600} />
      </View>
    );
  }

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TextField variant="title" style={{ color: t.textPrimary }}>
          Tus Consultas
        </TextField>
        <TextField variant="caption" style={{ color: t.textSecondary }}>
          Historial de los últimos 5 días
        </TextField>
      </View>

      <FlatList
        data={Array.isArray(conversations) ? conversations : []}
        keyExtractor={item => item.chatId}
        contentContainerStyle={s.listContent}
        refreshing={isLoading}
        onRefresh={refetch}
        ListEmptyComponent={
          <View style={s.empty}>
            <TextField
              variant="body"
              style={{ color: t.textSecondary, textAlign: 'center' }}
            >
              No tienes consultas recientes.{'\n'}¡Inicia una nueva para
              empezar!
            </TextField>
          </View>
        }
        renderItem={({ item }) => (
          <ConversationCard
            title={item.title}
            lastMessage={item.lastMessage}
            updatedAt={item.updatedAt}
            onPress={() => onSelectConversation(item.chatId)}
          />
        )}
      />

      <View style={s.footer}>
        <Button
          title="Nueva Consulta"
          variant="primary"
          onPress={onNewChat}
          style={s.button}
        />
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  empty: {
    marginTop: 40,
    paddingHorizontal: 40,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  button: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
});

export default ChatHistory;
