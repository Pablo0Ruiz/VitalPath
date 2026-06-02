import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

import { useTheme } from '@/src/hooks/useTheme';
import { useMemo } from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const MOODS = [
  {
    id: '1',
    icon: { name: 'sad-outline' as const, color: '#EF4444' },
    label: 'Mal',
  },
  {
    id: '2',
    icon: { name: 'sad-sharp' as const, color: '#F97316' },
    label: 'Regular',
  },
  {
    id: '3',
    icon: { name: 'remove-circle-outline' as const, color: '#6B7280' },
    label: 'Normal',
  },
  {
    id: '4',
    icon: { name: 'happy-outline' as const, color: '#22C55E' },
    label: 'Bien',
  },
  {
    id: '5',
    icon: { name: 'happy-sharp' as const, color: '#8B5CF6' },
    label: 'Excelente',
  },
] as const;

export type Mood = (typeof MOODS)[number];

export interface MoodItemProps {
  mood: Mood;
  isSelected: boolean;
  hasSelection: boolean;
  onPress: (mood: Mood) => void;
}

const MoodItem = ({
  mood,
  isSelected,
  hasSelection,
  onPress,
}: MoodItemProps) => {
  const t = useTheme();
  const scale = useSharedValue(1);

  const dynamicStyles = useMemo(
    () => ({
      moodItem: {
        width: Math.max(56, t.minTouchTarget),
        height: Math.max(56, t.minTouchTarget),
        borderRadius: Math.max(56, t.minTouchTarget) / 2,
      },
    }),
    [t.minTouchTarget],
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSequence(
      withSpring(1.35, { damping: 8, stiffness: 200 }),
      withSpring(1.0, { damping: 12, stiffness: 180 }),
    );
    onPress(mood);
  };

  const opacity = hasSelection && !isSelected ? 0.5 : 1;

  return (
    <Reanimated.View style={[animatedStyle, { opacity }]}>
      <Pressable
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={mood.label}
        accessibilityState={{ selected: isSelected }}
        style={[
          s.moodItem,
          dynamicStyles.moodItem,
          isSelected && s.moodItemSelected,
          isSelected && {
            borderColor: t.primary600,
            backgroundColor: t.primary50,
          },
        ]}
      >
        <Ionicons name={mood.icon.name} color={mood.icon.color} size={28} />
        <Text
          style={[
            s.moodLabel,
            { color: t.textSecondary, fontSize: t.fontSizeLabel },
          ]}
        >
          {mood.label}
        </Text>
      </Pressable>
    </Reanimated.View>
  );
};

export default MoodItem;

const s = StyleSheet.create({
  moodItem: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  moodItemSelected: {
    borderWidth: 2,
  },
  moodLabel: {
    textAlign: 'center',
    marginTop: 2,
  },
});
