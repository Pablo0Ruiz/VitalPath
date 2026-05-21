import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AppointmentStatus from '../AppointmentStatus';

jest.mock('@/src/hooks/useTheme', () => ({
  useTheme: () => ({
    background: '#fff',
    textPrimary: '#000',
    textSecondary: '#666',
    primary50: '#f0f9ff',
    primary100: '#e0f2fe',
    primary700: '#0369a1',
    secondary100: '#f0fdf4',
    secondary700: '#15803d',
    error: '#ef4444',
    errorLight: '#fee2e2',
    errorDark: '#991b1b',
    warningLight: '#fef9c3',
    warningDark: '#854d0e',
    infoLight: '#e0f2fe',
    infoDark: '#0369a1',
    successLight: '#dcfce7',
    successDark: '#166534',
    border: '#e5e7eb',
    minTouchTarget: 44,
  }),
}));

jest.mock('@repo/types', () => {
  const actual = jest.requireActual('@repo/types');
  return actual;
});

describe('AppointmentStatus', () => {
  const onCancelMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows cancel button for agendada when onCancel is provided', () => {
    const { getByText } = render(
      <AppointmentStatus status="agendada" onCancel={onCancelMock} />,
    );
    expect(getByText('Cancelar')).toBeTruthy();
  });

  it('calls onCancel when cancel button is pressed', () => {
    const { getByText } = render(
      <AppointmentStatus status="agendada" onCancel={onCancelMock} />,
    );
    fireEvent.press(getByText('Cancelar'));
    expect(onCancelMock).toHaveBeenCalledTimes(1);
  });

  it('does NOT show cancel button for asistida even with onCancel', () => {
    const { queryByText } = render(
      <AppointmentStatus status="asistida" onCancel={onCancelMock} />,
    );
    expect(queryByText('Cancelar')).toBeNull();
  });

  it('does NOT show cancel button for completada even with onCancel', () => {
    const { queryByText } = render(
      <AppointmentStatus status="completada" onCancel={onCancelMock} />,
    );
    expect(queryByText('Cancelar')).toBeNull();
  });

  it('does NOT show cancel button for cancelada', () => {
    const { queryByText } = render(
      <AppointmentStatus status="cancelada" onCancel={onCancelMock} />,
    );
    expect(queryByText('Cancelar')).toBeNull();
  });

  it('does NOT show cancel button for agendada without onCancel', () => {
    const { queryByText } = render(<AppointmentStatus status="agendada" />);
    expect(queryByText('Cancelar')).toBeNull();
  });

  it('does NOT show cancel button for en_proceso even with onCancel', () => {
    const { queryByText } = render(
      <AppointmentStatus status="en_proceso" onCancel={onCancelMock} />,
    );
    expect(queryByText('Cancelar')).toBeNull();
  });

  it('does NOT show cancel button for resultados_listos even with onCancel', () => {
    const { queryByText } = render(
      <AppointmentStatus status="resultados_listos" onCancel={onCancelMock} />,
    );
    expect(queryByText('Cancelar')).toBeNull();
  });
});
