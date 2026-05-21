import { useState } from 'react';
import { Pressable, StyleSheet, View, ViewProps } from 'react-native';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';
import { TextField } from '@/src/components/ui/atoms';
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
  };

  const handleAddPress = () => {
    if (onDayPressSheet && selectedDate) {
      onDayPressSheet(selectedDate);
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
      {onDayPressSheet && (
        <Pressable
          testID="calendar-add-button"
          style={[s.addButton, { backgroundColor: t.primary600 }]}
          onPress={handleAddPress}
        >
          <TextField variant="body" style={s.addButtonText}>
            + Agregar cita
          </TextField>
        </Pressable>
      )}
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
  addButton: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});
