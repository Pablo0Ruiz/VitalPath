import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { TextField } from '@/src/components/ui/atoms/TextField';
import MoodItem, {
  MOODS,
  type Mood,
} from '@/src/components/ui/atoms/MoodItem/MoodItem';
import { useTheme } from '@/src/hooks/useTheme';
import { useMoodCheckIn } from '@repo/api-client';

export const DailyCheckIn = () => {
  const t = useTheme();
  const [selected, setSelected] = useState<string | null>(null);
  const confirmOpacity = useSharedValue(0);
  const { mutate: checkIn } = useMoodCheckIn();

  const showConfirmation = () => {
    confirmOpacity.value = 0;
    confirmOpacity.value = withSequence(
      withTiming(1, { duration: 200 }),
      withDelay(3000, withTiming(0, { duration: 200 })),
    );
  };

  const handleSelect = (mood: Mood) => {
    setSelected(mood.id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    checkIn({ mood: mood.id, date: new Date().toISOString().split('T')[0] });
    showConfirmation();
  };

  const confirmStyle = useAnimatedStyle(() => ({
    opacity: confirmOpacity.value,
  }));

  return (
    <View style={s.container}>
      <TextField
        variant="body"
        style={[
          s.title,
          { color: t.textPrimary, fontSize: t.fontSizeBody + 2 },
        ]}
      >
        ¿Cómo te sentís hoy?
      </TextField>
      <View style={s.moodList}>
        {MOODS.map(mood => (
          <MoodItem
            key={mood.id}
            mood={mood}
            isSelected={selected === mood.id}
            hasSelection={selected !== null}
            onPress={handleSelect}
          />
        ))}
      </View>
      <Animated.View style={confirmStyle}>
        <TextField
          variant="caption"
          style={[s.confirmation, { color: t.primary600 }]}
        >
          Gracias, lo registramos
        </TextField>
      </Animated.View>
    </View>
  );
};

const s = StyleSheet.create({
  container: { marginBottom: 24 },
  title: { fontWeight: '700', marginBottom: 16 },
  moodList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  confirmation: {
    textAlign: 'center',
    marginTop: 10,
  },
});
