import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

import { useTheme } from '@/src/hooks/useTheme';
import { useMemo } from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

export const MOODS = [
  { id: '1', emoji: '😞', label: 'Mal' },
  { id: '2', emoji: '😕', label: 'Regular' },
  { id: '3', emoji: '😐', label: 'Normal' },
  { id: '4', emoji: '🙂', label: 'Bien' },
  { id: '5', emoji: '🤩', label: 'Excelente' },
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
      emoji: { fontSize: Math.max(32, t.fontSizeBody * 1.6) },
    }),
    [t.minTouchTarget, t.fontSizeBody],
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
        <Text style={[s.emoji, dynamicStyles.emoji]}>{mood.emoji}</Text>
        <Text style={[s.moodLabel, { color: t.textSecondary }]}>
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
  emoji: {
    textAlign: 'center',
  },
  moodLabel: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 2,
  },
});
