import { useMemo } from 'react';
import { View } from 'react-native';
import { TextField } from '../../atoms';
import { WEEK_DAYS } from '@/src/constants/monthAndDay';
import { RenderCells } from '../../molecules';

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
      <View className="flex-row justify-between mb-2">
        {WEEK_DAYS.map((day, idx) => (
          <View key={idx} className="w-[14%] items-center">
            <TextField
              variants="caption"
              className="text-slate-400 font-semibold"
            >
              {day}
            </TextField>
          </View>
        ))}
      </View>

      <View className="flex-row flex-wrap">
        {RenderCells({
          currentMonth,
          selectedDate,
          appointmentsMap,
          onDayPress,
          firstDayOfWeek,
          daysInMonth,
        })}
      </View>
    </View>
  );
};
