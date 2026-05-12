import { useState } from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { TextField } from '@/src/components/ui/atoms/TextField';
import { useTheme } from '@/src/hooks/useTheme';

const MOODS = [
  { id: '1', emoji: '😞', label: 'Mal' },
  { id: '2', emoji: '😕', label: 'Regular' },
  { id: '3', emoji: '😐', label: 'Normal' },
  { id: '4', emoji: '🙂', label: 'Bien' },
  { id: '5', emoji: '🤩', label: 'Excelente' },
];

export const DailyCheckIn = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const t = useTheme();

  return (
    <View style={s.container}>
      <TextField variant="body" style={[s.title, { color: t.textPrimary }]}>
        ¿Cómo te sentís hoy?
      </TextField>
      <View style={s.moodList}>
        {MOODS.map(mood => {
          const isSelected = selected === mood.id;
          return (
            <Pressable
              key={mood.id}
              onPress={() => setSelected(mood.id)}
              accessibilityLabel={mood.label}
              accessibilityRole="button"
              style={[
                s.moodItem,
                isSelected
                  ? [
                      s.selected,
                      {
                        backgroundColor: t.surfaceElevated,
                        shadowColor: '#000',
                      },
                    ]
                  : null,
              ]}
            >
              <Text style={s.emoji}>{mood.emoji}</Text>
            </Pressable>
          );
        })}
      </View>
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
  moodItem: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emoji: { fontSize: 32 },
});
