import { useState } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';
import { useTheme } from '@/src/hooks/useTheme';

export interface CalendarWidgetProps extends ViewProps {
  appointmentsMap: Record<string, boolean>;
  onDateChange?: (date: Date) => void;
  onDayPressSheet?: (date: Date) => void;
  initialDate?: Date;
}

export const CalendarWidget = ({
  appointmentsMap,
  onDateChange,
  onDayPressSheet,
  initialDate = new Date(),
  style,
  ...props
}: CalendarWidgetProps) => {
  const t = useTheme();

  const [currentMonth, setCurrentMonth] = useState<Date>(
    new Date(initialDate.getFullYear(), initialDate.getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate);

  const handlePrevMonth = () => {
    setCurrentMonth(
      prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    );
  };

  const handleDayPress = (date: Date) => {
    setSelectedDate(date);
    if (onDateChange) {
      onDateChange(date);
    }
    if (onDayPressSheet) {
      onDayPressSheet(date);
    }
  };

  return (
    <View
      style={[
        s.container,
        { backgroundColor: t.background, borderColor: t.border },
        style,
      ]}
      {...props}
    >
      <CalendarHeader
        currentMonth={currentMonth}
        onPrev={handlePrevMonth}
        onNext={handleNextMonth}
      />
      <CalendarGrid
        currentMonth={currentMonth}
        selectedDate={selectedDate}
        appointmentsMap={appointmentsMap}
        onDayPress={handleDayPress}
      />
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
});
