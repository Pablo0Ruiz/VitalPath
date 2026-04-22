import { useState } from 'react';
import { View, ViewProps } from 'react-native';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';

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
  className,
  ...props
}: CalendarWidgetProps) => {
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
      className={`bg-white rounded-3xl p-5 border border-zinc-100 ${className ?? ''}`}
      style={{
        elevation: 4,
        shadowColor: '#5B4CF5',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
      }}
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
