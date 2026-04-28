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
  style?: StyleProp<ViewStyle>;
}

export const EmptyState = ({
  icon,
  title,
  subtitle,
  action,
  style,
}: EmptyStateProps) => {
  const t = useTheme();

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
      {action && (
        <Button
          variant="secondary"
          size="sm"
          title={action.label}
          onPress={action.onPress}
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
