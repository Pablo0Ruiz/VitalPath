import { Octicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View, ViewProps } from 'react-native';
import { Button, TextField } from '../../atoms';
import { useTheme } from '@/src/hooks/useTheme';

export interface MedicationRowProps extends ViewProps {
  name: string;
  time?: string;
  description?: string;
  isDone?: boolean;
  onTakePress?: () => void;
  onDeletePress?: () => void;
  onEditPress?: () => void;
}

const MedicationRow = ({
  name,
  time,
  isDone,
  onTakePress,
  description,
  onDeletePress,
  onEditPress,
  style,
  ...props
}: MedicationRowProps) => {
  const t = useTheme();

  return (
    <View style={[s.base, style]} {...props}>
      <Pressable
        onPress={!isDone ? onTakePress : undefined}
        style={[
          s.checkbox,
          isDone
            ? { backgroundColor: t.success }
            : {
                borderColor: t.primary200,
                backgroundColor: t.primary50,
                borderWidth: 2,
              },
        ]}
      >
        {isDone && <Octicons name="check" size={14} color="white" />}
      </Pressable>

      <View style={s.content}>
        <TextField
          variant="body"
          style={[
            s.name,
            isDone
              ? { color: t.textSecondary, textDecorationLine: 'line-through' }
              : { color: t.textPrimary },
          ]}
        >
          {name}
        </TextField>
        {time && (
          <View style={s.timeWrapper}>
            <Octicons name="clock" size={10} color={t.textSecondary} />
            <TextField
              variant="caption"
              style={[s.timeText, { color: t.textSecondary }]}
            >
              {time}
            </TextField>
          </View>
        )}
        {description && (
          <TextField
            variant="caption"
            style={[s.description, { color: t.textSecondary }]}
          >
            {description}
          </TextField>
        )}
      </View>

      <View style={s.actions}>
        {!isDone && onTakePress && (
          <Button
            onPress={onTakePress}
            size="sm"
            style={[s.takeButton, { backgroundColor: t.primary100 }]}
          >
            <TextField
              variant="caption"
              style={[s.takeText, { color: t.primary700 }]}
            >
              Tomar
            </TextField>
          </Button>
        )}

        {onEditPress && (
          <Pressable
            onPress={onEditPress}
            style={[s.iconButton, { backgroundColor: t.neutral100 }]}
          >
            <Octicons name="pencil" size={12} color={t.neutral600} />
          </Pressable>
        )}

        {onDeletePress && (
          <Pressable
            onPress={onDeletePress}
            style={[s.iconButton, { backgroundColor: t.errorLight }]}
          >
            <Octicons name="trash" size={12} color={t.error} />
          </Pressable>
        )}
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  base: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: { flex: 1 },
  name: { fontSize: 14, fontWeight: '600' },
  timeWrapper: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  timeText: { fontSize: 12, marginLeft: 4 },
  description: { fontSize: 12, marginTop: 2 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  takeButton: { borderRadius: 9999, paddingHorizontal: 12, paddingVertical: 6 },
  takeText: { fontWeight: '600', fontSize: 12 },
  iconButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MedicationRow;
