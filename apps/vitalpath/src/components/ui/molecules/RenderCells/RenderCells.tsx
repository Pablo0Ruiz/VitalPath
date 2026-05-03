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

  for (let i = 0; i < firstDayOfWeek; i++) {
    cells.push(<View key={`empty-${i}`} style={s.cell} />);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const hasAppointment = appointmentsMap[dateString];

    let isSelected = false;
    if (selectedDate) {
      isSelected =
        selectedDate.getFullYear() === year &&
        selectedDate.getMonth() === month &&
        selectedDate.getDate() === i;
    }

    cells.push(
      <Button
        key={`day-${i}`}
        onPress={() => onDayPress(date)}
        variant={isSelected ? 'outline' : 'ghost'}
        style={[
          s.cell,
          isSelected
            ? [
                s.selected,
                {
                  borderColor: t.primary600,
                  backgroundColor: t.surfaceElevated,
                },
              ]
            : null,
        ]}
      >
        <TextField
          variant="body"
          style={[
            s.dayText,
            { color: isSelected ? t.primary600 : t.textPrimary },
            isSelected && s.bold,
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
  },
  selected: {
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
