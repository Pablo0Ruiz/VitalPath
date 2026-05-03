import { StyleSheet, View, ViewProps } from 'react-native';
import { TextField } from '../TextField';
import {
  badgeContainerStyle,
  badgeTextStyle,
  type BadgeVariant,
} from './Badge.variants';
import { useTheme } from '@/src/hooks/useTheme';

export interface BadgeProps extends ViewProps {
  label: string;
  variant?: BadgeVariant;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Badge = ({
  label,
  variant = 'neutral',
  leftIcon,
  rightIcon,
  style,
  ...props
}: BadgeProps) => {
  const t = useTheme();

  return (
    <View style={[s.base, badgeContainerStyle(variant, t), style]} {...props}>
      {leftIcon}
      <TextField variant="caption" style={[s.text, badgeTextStyle(variant, t)]}>
        {label}
      </TextField>
      {rightIcon}
    </View>
  );
};

const s = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    gap: 6,
  },
  text: { fontSize: 12, fontWeight: '600' },
});

export default Badge;
