import { useRef, useState } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
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
  const confirmOpacity = useRef(new Animated.Value(0)).current;
  const { mutate: checkIn } = useMoodCheckIn();

  const showConfirmation = () => {
    confirmOpacity.setValue(0);
    Animated.sequence([
      Animated.timing(confirmOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.delay(3000),
      Animated.timing(confirmOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSelect = (mood: Mood) => {
    setSelected(mood.id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    checkIn({ mood: mood.id, date: new Date().toISOString().split('T')[0] });
    showConfirmation();
  };

  return (
    <View style={s.container}>
      <TextField variant="body" style={[s.title, { color: t.textPrimary }]}>
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
      <Animated.View style={{ opacity: confirmOpacity }}>
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
  title: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
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
