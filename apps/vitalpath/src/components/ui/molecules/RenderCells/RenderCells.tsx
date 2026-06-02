import { StyleSheet, View } from 'react-native';
import { Button, TextField } from '../../atoms';
import { useTheme } from '@/src/hooks/useTheme';

export interface RenderCellsProps {
  currentMonth: Date;
  selectedDate: Date | null;
  appointmentsMap: Record<string, boolean>;
  onDayPress: (date: Date) => void;
  firstDayOfWeek: number;
  daysInMonth: number;
}

const RenderCells = ({
  currentMonth,
  selectedDate,
  appointmentsMap,
  onDayPress,
  firstDayOfWeek,
  daysInMonth,
}: RenderCellsProps) => {
  const t = useTheme();
  const cells = [];
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const now = new Date();
  const todayYear = now.getFullYear();
  const todayMonth = now.getMonth();
  const todayDay = now.getDate();

  for (let i = 0; i < firstDayOfWeek; i++) {
    cells.push(<View key={`empty-${i}`} style={s.cell} />);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const hasAppointment = appointmentsMap[dateString];

    const isToday =
      year === todayYear && month === todayMonth && i === todayDay;
    const isPast =
      year < todayYear ||
      (year === todayYear && month < todayMonth) ||
      (year === todayYear && month === todayMonth && i < todayDay);

    let isSelected = false;
    if (selectedDate) {
      isSelected =
        selectedDate.getFullYear() === year &&
        selectedDate.getMonth() === month &&
        selectedDate.getDate() === i;
    }

    let dayTextColor = t.textPrimary;
    if (isSelected) dayTextColor = t.primary600;
    else if (isToday) dayTextColor = t.primary600;
    else if (isPast) dayTextColor = t.textSecondary;

    cells.push(
      <Button
        key={`day-${i}`}
        onPress={() => onDayPress(date)}
        variant={isSelected || isToday ? 'outline' : 'ghost'}
        style={[
          s.cell,
          isToday && !isSelected
            ? [s.today, { borderColor: t.primary600 }]
            : null,
          isSelected
            ? [
                s.selected,
                {
                  borderColor: t.primary600,
                  backgroundColor: t.surfaceElevated,
                },
              ]
            : null,
          isPast && !isSelected ? s.pastCell : null,
        ]}
      >
        <TextField
          variant="body"
          style={[
            s.dayText,
            { color: dayTextColor },
            (isSelected || isToday) && s.bold,
          ]}
        >
          {i}
        </TextField>

        <View style={s.dotContainer}>
          {hasAppointment && (
            <View style={[s.dot, { backgroundColor: t.primary600 }]} />
          )}
        </View>
      </Button>,
    );
  }
  return cells;
};

const s = StyleSheet.create({
  cell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingHorizontal: 0,
  },
  selected: {
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  today: {
    borderWidth: 1,
  },
  pastCell: {
    opacity: 0.4,
  },
  dayText: { textAlign: 'center', fontSize: 14 },
  bold: { fontWeight: '700' },
  dotContainer: {
    height: 4,
    flexDirection: 'row',
    marginTop: 2,
    justifyContent: 'center',
  },
  dot: { width: 4, height: 4, borderRadius: 2 },
});

export default RenderCells;
