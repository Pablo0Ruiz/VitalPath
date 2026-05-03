import { View, StyleSheet, Pressable } from 'react-native';
import { TextField } from '@/src/components/ui/atoms';
import { useTheme } from '@/src/hooks/useTheme';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ConversationCardProps {
  title: string;
  lastMessage?: string;
  updatedAt: string;
  onPress: () => void;
}

const ConversationCard = ({
  title,
  lastMessage,
  updatedAt,
  onPress,
}: ConversationCardProps) => {
  const t = useTheme();
  const date = new Date(updatedAt);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        s.container,
        {
          backgroundColor: pressed ? t.surfaceElevated : t.background,
          borderColor: t.border,
          shadowColor: t.neutral950,
        },
      ]}
    >
      <View style={s.header}>
        <TextField variant="body" style={[s.title, { color: t.textPrimary }]}>
          {title || 'Nueva Consulta'}
        </TextField>
        <TextField variant="caption" style={{ color: t.textSecondary }}>
          {format(date, 'HH:mm', { locale: es })}
        </TextField>
      </View>

      <TextField
        variant="caption"
        numberOfLines={2}
        style={[s.lastMessage, { color: t.textSecondary }]}
      >
        {lastMessage || 'Sin mensajes aún...'}
      </TextField>

      <View style={s.footer}>
        <TextField variant="label" style={{ color: t.primary600 }}>
          {format(date, "d 'de' MMMM", { locale: es })}
        </TextField>
      </View>
    </Pressable>
  );
};

const s = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
    flex: 1,
    marginRight: 12,
  },
  lastMessage: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 12,
  },
});

export default ConversationCard;
