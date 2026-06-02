import React from 'react';
import { render } from '@testing-library/react-native';

// ── Theme ────────────────────────────────────────────────────────────────────
jest.mock('@/src/hooks/useTheme', () => ({
  useTheme: () => ({
    background: '#F6F4F9',
    surface: '#FDFCFF',
    surfaceElevated: '#FFFFFF',
    textPrimary: '#1C1030',
    textSecondary: '#5C5670',
    textInverse: '#FFFFFF',
    border: '#E5DEED',
    primary50: '#F5F0FB',
    primary100: '#EBE1F7',
    primary200: '#D7C3EF',
    primary500: '#8B5DC8',
    primary600: '#4B2067',
    primary700: '#3A1852',
    primary900: '#1E0C2B',
    neutral100: '#F4F4F5',
    error: '#FF4D6A',
    white: '#FFFFFF',
    black: '#000000',
    fontSizeTitle: 28,
    fontSizeBody: 14,
    fontSizeCaption: 12,
    fontSizeLabel: 11,
    minTouchTarget: 44,
  }),
}));

import RenderCells from '../RenderCells';

const baseProps = {
  currentMonth: new Date(2026, 0, 1), // January 2026
  selectedDate: null,
  appointmentsMap: {},
  onDayPress: jest.fn(),
  firstDayOfWeek: 0,
  daysInMonth: 31,
};

describe('RenderCells — day number visibility', () => {
  it('renders two-digit day "28" fully visible', () => {
    const { getByText } = render(<>{RenderCells(baseProps)}</>);
    expect(getByText('28')).toBeTruthy();
  });

  it('renders two-digit day "31" fully visible', () => {
    const { getByText } = render(<>{RenderCells(baseProps)}</>);
    expect(getByText('31')).toBeTruthy();
  });

  it('renders first two-digit day "10" fully visible', () => {
    const { getByText } = render(<>{RenderCells(baseProps)}</>);
    expect(getByText('10')).toBeTruthy();
  });

  it('renders single-digit day "1" fully visible', () => {
    const { getByText } = render(<>{RenderCells(baseProps)}</>);
    expect(getByText('1')).toBeTruthy();
  });
});
