import React from 'react';
import { render } from '@testing-library/react-native';

// Mock useRole — controls which branch renders
let mockRole: string | null = 'paciente';
jest.mock('@/src/hooks/useRole', () => ({
  useRole: () => mockRole,
}));

// Mock CuidadorAppointmentsView
jest.mock(
  '@/src/components/ui/molecules/CuidadorAppointmentsView/CuidadorAppointmentsView',
  () => {
    const { View, Text } = require('react-native');
    const mockReact = require('react');
    return {
      CuidadorAppointmentsView: () =>
        mockReact.createElement(
          View,
          { testID: 'cuidador-appointments-view' },
          mockReact.createElement(Text, null, 'CuidadorAppointmentsView'),
        ),
    };
  },
);

// Mock the paciente appointments screen dependencies
jest.mock('@/src/hooks/useTheme', () => ({
  useTheme: () => ({
    background: '#fff',
    textPrimary: '#000',
    textSecondary: '#666',
    primary50: '#f0f9ff',
    primary600: '#2563eb',
    error: '#ef4444',
    minTouchTarget: 44,
  }),
}));

jest.mock('@/src/hooks', () => ({
  useActivePatientId: () => ({ patientId: 'patient-1', needsSelection: false }),
  useDisclosure: () => ({
    isOpen: false,
    open: jest.fn(),
    close: jest.fn(),
    data: null,
  }),
}));

jest.mock('@repo/api-client', () => ({
  useCitas: () => ({ data: [], isLoading: false, isRefetching: false }),
  useCancelCita: () => ({ mutate: jest.fn(), isPending: false }),
  useDoctors: () => ({ data: null, isLoading: false }),
  useCreateCita: () => ({ mutateAsync: jest.fn(), isPending: false }),
}));

jest.mock('@react-navigation/native', () => ({
  DrawerActions: { openDrawer: jest.fn() },
  useNavigation: () => ({ dispatch: jest.fn() }),
}));

import AppointmentsScreen from '../index';

describe('AppointmentsScreen — role branching', () => {
  beforeEach(() => {
    mockRole = 'paciente';
  });

  it('renders CuidadorAppointmentsView when role is cuidador_familiar', () => {
    mockRole = 'cuidador_familiar';
    const { getByTestId } = render(<AppointmentsScreen />);
    expect(getByTestId('cuidador-appointments-view')).toBeTruthy();
  });

  it('renders default paciente view when role is paciente', () => {
    mockRole = 'paciente';
    const { queryByTestId } = render(<AppointmentsScreen />);
    expect(queryByTestId('cuidador-appointments-view')).toBeNull();
  });

  it('renders default paciente view when role is null', () => {
    mockRole = null;
    const { queryByTestId } = render(<AppointmentsScreen />);
    expect(queryByTestId('cuidador-appointments-view')).toBeNull();
  });
});
