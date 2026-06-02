import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@/src/hooks/useTheme';

interface TimeSlotChipProps {
  slot: string;
  isActive: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export const TimeSlotChip = ({
  slot,
  isActive,
  onPress,
  style,
}: TimeSlotChipProps) => {
  const t = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        s.base,
        {
          borderColor: t.border,
          backgroundColor: isActive ? t.primary600 : t.surfaceElevated,
        },
        style,
      ]}
    >
      <Text style={[s.text, { color: isActive ? '#FFFFFF' : t.textPrimary }]}>
        {slot}
      </Text>
    </Pressable>
  );
};

const s = StyleSheet.create({
  base: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 9999,
    borderWidth: 1,
    minWidth: 72,
    alignItems: 'center',
  },
  text: { fontSize: 14, fontWeight: '500' },
});

export default TimeSlotChip;
