import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
        className="w-10 h-10 items-center justify-center rounded-full bg-zinc-100 active:bg-zinc-200"
      >
        <Ionicons name="chevron-back" size={20} color="#0D0F1C" />
      </Button>

      <View>
        <TextField
          variant="subtitle"
          className="text-center font-bold text-lg text-[#0D0F1C]"
        >
          {monthName} {year}
        </TextField>
      </View>

      <Button
        onPress={onNext}
        className="w-10 h-10 items-center justify-center rounded-full bg-zinc-100 active:bg-zinc-200"
      >
        <Ionicons name="chevron-forward" size={20} color="#0D0F1C" />
      </Button>
    </View>
  );
};
