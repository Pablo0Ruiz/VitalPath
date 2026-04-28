import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, TextField } from '../../atoms';
import { MONTH_NAMES } from '@/src/constants/monthAndDay';
import { useTheme } from '@/src/hooks/useTheme';

export interface CalendarHeaderProps {
  currentMonth: Date;
  onPrev: () => void;
  onNext: () => void;
}

export const CalendarHeader = ({
  currentMonth,
  onPrev,
  onNext,
}: CalendarHeaderProps) => {
  const t = useTheme();
  const monthName = MONTH_NAMES[currentMonth.getMonth()];
  const year = currentMonth.getFullYear();

  return (
    <View style={s.container}>
      <Button
        onPress={onPrev}
        variant="ghost"
        size="sm"
        style={[s.iconButton, { backgroundColor: t.neutral100 }]}
      >
        <Ionicons name="chevron-back" size={20} color={t.textPrimary} />
      </Button>

      <View>
        <TextField
          variant="title"
          style={[s.monthText, { color: t.textPrimary }]}
        >
          {monthName} {year}
        </TextField>
      </View>

      <Button
        onPress={onNext}
        variant="ghost"
        size="sm"
        style={[s.iconButton, { backgroundColor: t.neutral100 }]}
      >
        <Ionicons name="chevron-forward" size={20} color={t.textPrimary} />
      </Button>
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  monthText: { textAlign: 'center', fontWeight: '700', fontSize: 18 },
});
