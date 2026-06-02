import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Button } from '../Button';
import { TextField } from '../TextField';
import { useTheme } from '@/src/hooks/useTheme';

export interface EmptyStateProps {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  subtitle: string;
  action?: { label: string; onPress: () => void };
  actionLabel?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const EmptyState = ({
  icon,
  title,
  subtitle,
  action,
  actionLabel,
  onAction,
  style,
}: EmptyStateProps) => {
  const t = useTheme();
  const resolvedAction =
    action ??
    (actionLabel && onAction
      ? { label: actionLabel, onPress: onAction }
      : undefined);

  return (
    <View style={[s.container, style]}>
      <View style={[s.iconWrapper, { backgroundColor: t.primary50 }]}>
        <Feather name={icon} size={28} color={t.primary600} />
      </View>
      <TextField variant="title" style={[s.title, { color: t.textPrimary }]}>
        {title}
      </TextField>
      <TextField
        variant="caption"
        style={[s.subtitle, { color: t.textSecondary }]}
      >
        {subtitle}
      </TextField>
      {resolvedAction && (
        <Button
          variant="secondary"
          size="sm"
          title={resolvedAction.label}
          onPress={resolvedAction.onPress}
          style={s.action}
        />
      )}
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: { marginBottom: 6, textAlign: 'center' },
  subtitle: { textAlign: 'center', lineHeight: 18 },
  action: { marginTop: 20 },
});

export default EmptyState;
