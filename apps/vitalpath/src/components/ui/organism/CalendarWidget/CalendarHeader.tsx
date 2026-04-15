import { View } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { Button, TextField } from '../../atoms';
import { MONTH_NAMES } from '@/src/constants/monthAndDay';

export interface CalendarHeaderProps {
  currentMonth: Date;
  onPrev: () => void;
  onNext: () => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentMonth,
  onPrev,
  onNext,
}) => {
  const monthName = MONTH_NAMES[currentMonth.getMonth()];
  const year = currentMonth.getFullYear();

  return (
    <View className="flex-row items-center justify-between mb-4">
      <Button
        onPress={onPrev}
        className="w-10 h-10 items-center justify-center rounded-full bg-slate-100 active:bg-slate-200"
      >
        <Octicons name="chevron-left" size={20} color="#0f172a" />
      </Button>

      <View>
        <TextField
          variants="subtitle"
          className="text-center font-bold text-lg text-slate-800"
        >
          {monthName} {year}
        </TextField>
      </View>

      <Button
        onPress={onNext}
        className="w-10 h-10 items-center justify-center rounded-full bg-slate-100 active:bg-slate-200"
      >
        <Octicons name="chevron-right" size={20} color="#0f172a" />
      </Button>
    </View>
  );
};
