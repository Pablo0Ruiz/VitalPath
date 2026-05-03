import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextField } from '../../atoms';
import { WEEK_DAYS } from '@/src/constants/monthAndDay';
import { RenderCells } from '../../molecules';
import { useTheme } from '@/src/hooks/useTheme';

export interface CalendarGridProps {
  currentMonth: Date;
  selectedDate: Date | null;
  appointmentsMap: Record<string, boolean>;
  onDayPress: (date: Date) => void;
}

export const CalendarGrid = ({
  currentMonth,
  selectedDate,
  appointmentsMap,
  onDayPress,
}: CalendarGridProps) => {
  const t = useTheme();

  const { daysInMonth, firstDayOfWeek } = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    return {
      daysInMonth: lastDay.getDate(),
      firstDayOfWeek: firstDay.getDay(),
    };
  }, [currentMonth]);

  return (
    <View>
      <View style={s.weekDaysRow}>
        {WEEK_DAYS.map((day, idx) => (
          <View key={idx} style={s.weekDayCell}>
            <TextField
              variant="caption"
              style={[s.weekDayText, { color: t.textSecondary }]}
            >
              {day}
            </TextField>
          </View>
        ))}
      </View>

      <View style={s.grid}>
        <RenderCells
          currentMonth={currentMonth}
          selectedDate={selectedDate}
          appointmentsMap={appointmentsMap}
          onDayPress={onDayPress}
          firstDayOfWeek={firstDayOfWeek}
          daysInMonth={daysInMonth}
        />
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  weekDayCell: { width: '14.28%', alignItems: 'center' },
  weekDayText: { fontWeight: '600', fontSize: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
});
