import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AppointmentCard from '../AppointmentCard';
import type { CitaPopulated } from '@repo/types';

jest.mock('@/src/hooks/useTheme', () => ({
  useTheme: () => ({
    background: '#fff',
    surface: '#fafafa',
    surfaceElevated: '#fff',
    textPrimary: '#000',
    textSecondary: '#666',
    textInverse: '#fff',
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
    neutral100: '#f4f4f5',
    minTouchTarget: 44,
  }),
}));

const makeAppointment = (
  overrides: Partial<CitaPopulated> = {},
): CitaPopulated => ({
  _id: 'cita-1',
  fecha: '2025-01-15',
  hora: '10:30',
  estado: 'agendada',
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
  medico_ID: {
    _id: 'doc-1',
    name: 'Carlos',
    lastName: 'Ruiz',
    especialidad: 'Cardiología',
  },
  centroSalud_ID: {
    _id: 'centro-1',
    nombre: 'Centro Médico Norte',
    direccion: 'Av. Principal 123',
  },
  paciente_ID: {
    _id: 'pac-1',
    name: 'Ana',
    lastName: 'García',
  },
  ...overrides,
});

describe('AppointmentCard', () => {
  it('renders without crashing', () => {
    const { getByText } = render(
      <AppointmentCard appointment={makeAppointment()} />,
    );
    expect(getByText('Carlos Ruiz')).toBeTruthy();
  });

  describe('isOverdue behavior', () => {
    it('shows reschedule button when isOverdue=true', () => {
      const { getByTestId } = render(
        <AppointmentCard
          appointment={makeAppointment()}
          isOverdue={true}
          onReschedule={jest.fn()}
        />,
      );
      expect(getByTestId('reschedule-button')).toBeTruthy();
    });

    it('shows "Reagendar" text label when isOverdue=true', () => {
      const { getByText } = render(
        <AppointmentCard
          appointment={makeAppointment()}
          isOverdue={true}
          onReschedule={jest.fn()}
        />,
      );
      expect(getByText('Reagendar')).toBeTruthy();
    });

    it('does NOT show cancel button when isOverdue=true', () => {
      const { queryByText } = render(
        <AppointmentCard
          appointment={makeAppointment({ estado: 'agendada' })}
          isOverdue={true}
          onReschedule={jest.fn()}
          onCancel={jest.fn()}
        />,
      );
      expect(queryByText('Cancelar')).toBeNull();
    });

    it('applies overdue red border style when isOverdue=true', () => {
      const { getByTestId } = render(
        <AppointmentCard
          appointment={makeAppointment()}
          isOverdue={true}
          onReschedule={jest.fn()}
          testID="overdue-card"
        />,
      );
      const card = getByTestId('overdue-card');
      const flatStyle = Array.isArray(card.props.style)
        ? card.props.style.flat()
        : [card.props.style];
      const combined = Object.assign({}, ...flatStyle.filter(Boolean));
      expect(combined.borderColor).toBe('#ef4444');
    });

    it('does NOT show reschedule button when isOverdue=false', () => {
      const { queryByTestId } = render(
        <AppointmentCard appointment={makeAppointment()} isOverdue={false} />,
      );
      expect(queryByTestId('reschedule-button')).toBeNull();
    });

    it('does NOT show reschedule button when isOverdue is absent', () => {
      const { queryByTestId } = render(
        <AppointmentCard appointment={makeAppointment()} />,
      );
      expect(queryByTestId('reschedule-button')).toBeNull();
    });

    it('calls onReschedule when reschedule button is pressed', () => {
      const onRescheduleMock = jest.fn();
      const { getByTestId } = render(
        <AppointmentCard
          appointment={makeAppointment()}
          isOverdue={true}
          onReschedule={onRescheduleMock}
        />,
      );
      fireEvent.press(getByTestId('reschedule-button'));
      expect(onRescheduleMock).toHaveBeenCalledTimes(1);
    });
  });
});
