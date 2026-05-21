import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CalendarWidget } from '../CalendarWidget';

jest.mock('@/src/hooks/useTheme', () => ({
  useTheme: () => ({
    background: '#fff',
    textPrimary: '#000',
    textSecondary: '#666',
    border: '#e5e7eb',
    primary600: '#2563eb',
    neutral100: '#f4f4f5',
    minTouchTarget: 44,
  }),
}));

// Mock RenderCells so we can control day press interactions
jest.mock('@/src/components/ui/molecules', () => {
  const { TouchableOpacity, Text } = require('react-native');
  const mockReact = require('react');
  return {
    RenderCells: ({ onDayPress }: { onDayPress: (date: Date) => void }) =>
      mockReact.createElement(
        TouchableOpacity,
        {
          testID: 'calendar-day',
          onPress: () => onDayPress(new Date(2026, 4, 21)),
        },
        mockReact.createElement(Text, null, '21'),
      ),
  };
});

describe('CalendarWidget', () => {
  const appointmentsMap = {};
  const fixedDate = new Date(2026, 4, 1);

  it('calls onDateChange when a day is pressed', () => {
    const onDateChange = jest.fn();
    const onDayPressSheet = jest.fn();
    const { getByTestId } = render(
      <CalendarWidget
        appointmentsMap={appointmentsMap}
        onDateChange={onDateChange}
        onDayPressSheet={onDayPressSheet}
        initialDate={fixedDate}
      />,
    );
    fireEvent.press(getByTestId('calendar-day'));
    expect(onDateChange).toHaveBeenCalledTimes(1);
  });

  it('does NOT call onDayPressSheet automatically when a day is pressed', () => {
    const onDateChange = jest.fn();
    const onDayPressSheet = jest.fn();
    const { getByTestId } = render(
      <CalendarWidget
        appointmentsMap={appointmentsMap}
        onDateChange={onDateChange}
        onDayPressSheet={onDayPressSheet}
        initialDate={fixedDate}
      />,
    );
    fireEvent.press(getByTestId('calendar-day'));
    expect(onDayPressSheet).not.toHaveBeenCalled();
  });

  it('onDayPressSheet prop exists on the interface and can be called explicitly via onAddPress', () => {
    const onDateChange = jest.fn();
    const onDayPressSheet = jest.fn();
    const { getByTestId } = render(
      <CalendarWidget
        appointmentsMap={appointmentsMap}
        onDateChange={onDateChange}
        onDayPressSheet={onDayPressSheet}
        initialDate={fixedDate}
      />,
    );
    // Simulate explicit "add" button press via the exposed onAddPress trigger
    fireEvent.press(getByTestId('calendar-add-button'));
    expect(onDayPressSheet).toHaveBeenCalledTimes(1);
  });
});
