import { Pressable, StyleSheet, Switch, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { TextField } from '@/src/components/ui/atoms';
import { useTheme } from '@/src/hooks/useTheme';

export interface SettingsRowProps {
  label: string;
  value?: string;
  icon?: React.ReactNode;
  toggle?: boolean;
  onToggle?: (value: boolean) => void;
  onPress?: () => void;
  noBorder?: boolean;
}

export const SettingsRow = ({
  label,
  value,
  icon,
  toggle,
  onToggle,
  onPress,
  noBorder = false,
}: SettingsRowProps) => {
  const t = useTheme();

  const content = (
    <View
      style={[
        s.row,
        !noBorder && { borderBottomWidth: 1, borderBottomColor: t.border },
      ]}
    >
      {icon && <View style={s.icon}>{icon}</View>}
      <View style={s.text}>
        <TextField variant="body" style={{ color: t.textPrimary }}>
          {label}
        </TextField>
        {value !== undefined && (
          <TextField
            variant="caption"
            style={{ color: t.textSecondary, marginTop: 2 }}
          >
            {value}
          </TextField>
        )}
      </View>
      {toggle !== undefined && onToggle !== undefined && (
        <Switch
          value={toggle}
          onValueChange={onToggle}
          trackColor={{ false: t.border, true: t.primary600 }}
          thumbColor="#FFFFFF"
        />
      )}
      {onPress && toggle === undefined && (
        <Ionicons name="chevron-forward" size={18} color={t.neutral400} />
      )}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        testID={`settings-row-${label}`}
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={onPress}
        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
      >
        {content}
      </Pressable>
    );
  }

  return <View testID={`settings-row-${label}`}>{content}</View>;
};

const s = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    minHeight: 44,
  },
  icon: {
    marginRight: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
  },
});
