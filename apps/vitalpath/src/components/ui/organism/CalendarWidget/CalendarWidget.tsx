import { useState } from 'react';
import { View, ViewProps } from 'react-native';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';

export interface CalendarWidgetProps extends ViewProps {
  appointmentsMap: Record<string, boolean>;
  onDateChange?: (date: Date) => void;
  initialDate?: Date;
}

export const CalendarWidget: React.FC<CalendarWidgetProps> = ({
  appointmentsMap,
  onDateChange,
  initialDate = new Date(),
  className,
  ...props
}) => {
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
  };

  return (
    <View
      className={`bg-red-400 rounded-3xl p-5 shadow-sm border border-brand-violet-100 ${className ?? ''}`}
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
