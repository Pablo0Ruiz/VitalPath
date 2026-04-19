import { View } from 'react-native';
import { Button, TextField } from '../../atoms';

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
  const cells = [];
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  for (let i = 0; i < firstDayOfWeek; i++) {
    cells.push(<View key={`empty-${i}`} className="w-[14%] aspect-square" />);
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
        className={`w-[14%] aspect-square items-center justify-center rounded-full ${
          isSelected ? 'bg-[#5B4CF5]' : 'bg-transparent'
        }`}
      >
        <TextField
          variant="body"
          className={`text-center ${isSelected ? 'text-white' : 'text-[#0D0F1C]'}`}
        >
          {i}
        </TextField>

        <View className="h-1 flex-row mt-0.5 justify-center">
          {hasAppointment && (
            <View
              className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-[#5B4CF5]'}`}
            />
          )}
        </View>
      </Button>,
    );
  }
  return cells;
};

export default RenderCells;
