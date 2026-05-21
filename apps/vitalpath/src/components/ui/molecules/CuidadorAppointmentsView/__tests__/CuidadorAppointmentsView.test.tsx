import React from 'react';
import { render } from '@testing-library/react-native';
import { CuidadorAppointmentsView } from '../CuidadorAppointmentsView';
import type { CitaPopulated } from '@repo/types';

// Mock useTheme
jest.mock('@/src/hooks/useTheme', () => ({
  useTheme: () => ({
    background: '#fff',
    textPrimary: '#000',
    textSecondary: '#666',
    primary50: '#f0f9ff',
    primary600: '#2563eb',
    border: '#e5e7eb',
    error: '#ef4444',
    minTouchTarget: 44,
  }),
}));

// Mock useCitasForCuidador
const mockUseCitasForCuidador = jest.fn();
jest.mock('@repo/api-client', () => ({
  useCitasForCuidador: (patientId: string | null) =>
    mockUseCitasForCuidador(patientId),
}));

// Mock useActivePatientId
let mockPatientId: string | null = 'patient-1';
let mockNeedsSelection = false;
jest.mock('@/src/hooks', () => ({
  useActivePatientId: () => ({
    patientId: mockPatientId,
    isCuidador: true,
    needsSelection: mockNeedsSelection,
  }),
}));

// Mock navigation
jest.mock('expo-router', () => ({
  useNavigation: () => ({ dispatch: jest.fn() }),
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
  useLocalSearchParams: () => ({}),
  useSegments: () => [],
  Link: 'Link',
}));

jest.mock('@react-navigation/native', () => ({
  DrawerActions: { openDrawer: jest.fn() },
  useNavigation: () => ({ dispatch: jest.fn() }),
}));

const makeCita = (overrides: Partial<CitaPopulated> = {}): CitaPopulated => ({
  _id: 'cita-1',
  fecha: new Date().toISOString().split('T')[0],
  hora: '10:00',
  estado: 'agendada',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  medico_ID: {
    _id: 'medico-1',
    name: 'Juan',
    lastName: 'Pérez',
    especialidad: 'Cardiología',
  },
  centroSalud_ID: {
    _id: 'centro-1',
    nombre: 'Centro Salud',
    direccion: 'Av. 1',
  },
  paciente_ID: {
    _id: 'paciente-1',
    name: 'Ana',
    lastName: 'García',
  },
  ...overrides,
});

describe('CuidadorAppointmentsView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPatientId = 'patient-1';
    mockNeedsSelection = false;
  });

  it('shows loading screen while fetching', () => {
    mockUseCitasForCuidador.mockReturnValue({
      data: undefined,
      isLoading: true,
      isRefetching: false,
    });
    const { getByTestId } = render(<CuidadorAppointmentsView />);
    expect(getByTestId('loading-screen')).toBeTruthy();
  });

  it('renders list of appointments when patientId is set', () => {
    mockUseCitasForCuidador.mockReturnValue({
      data: [makeCita(), makeCita({ _id: 'cita-2' })],
      isLoading: false,
      isRefetching: false,
    });
    const { getAllByTestId } = render(<CuidadorAppointmentsView />);
    expect(getAllByTestId('appointment-card')).toHaveLength(2);
  });

  it('shows empty-patient state when no active patient is selected', () => {
    mockPatientId = null;
    mockNeedsSelection = true;
    mockUseCitasForCuidador.mockReturnValue({
      data: undefined,
      isLoading: false,
      isRefetching: false,
    });
    const { getByText } = render(<CuidadorAppointmentsView />);
    expect(getByText(/seleccioná un paciente/i)).toBeTruthy();
  });

  it('shows empty state when appointment list is empty', () => {
    mockUseCitasForCuidador.mockReturnValue({
      data: [],
      isLoading: false,
      isRefetching: false,
    });
    const { getByText } = render(<CuidadorAppointmentsView />);
    expect(getByText(/sin citas/i)).toBeTruthy();
  });

  it('passes patientId to useCitasForCuidador', () => {
    mockPatientId = 'test-patient-id';
    mockUseCitasForCuidador.mockReturnValue({
      data: [],
      isLoading: false,
      isRefetching: false,
    });
    render(<CuidadorAppointmentsView />);
    expect(mockUseCitasForCuidador).toHaveBeenCalledWith('test-patient-id');
  });

  it('does NOT render DoctorPickerSheet or CalendarWidget', () => {
    mockUseCitasForCuidador.mockReturnValue({
      data: [],
      isLoading: false,
      isRefetching: false,
    });
    const { queryByTestId } = render(<CuidadorAppointmentsView />);
    expect(queryByTestId('doctor-picker-sheet')).toBeNull();
    expect(queryByTestId('calendar-widget')).toBeNull();
  });
});
