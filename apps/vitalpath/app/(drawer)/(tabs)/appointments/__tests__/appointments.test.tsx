import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

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
    errorLight: '#fee2e2',
    neutral100: '#f4f4f5',
    neutral200: '#e5e7eb',
    neutral400: '#9ca3af',
    neutral600: '#4b5563',
    border: '#e5e7eb',
    surfaceElevated: '#fff',
    minTouchTarget: 44,
  }),
}));

// Prefixed with mock so jest.mock factory can reference it
let mockDisclosureOpen = jest.fn();
let mockDisclosureClose = jest.fn();
let mockDisclosureIsOpen = false;
let mockDisclosureData: null | { citaId: string; fecha: string; hora: string } =
  null;

jest.mock('@/src/hooks', () => ({
  useActivePatientId: () => ({ patientId: 'patient-1', needsSelection: false }),
  useDisclosure: () => ({
    isOpen: mockDisclosureIsOpen,
    open: mockDisclosureOpen,
    close: mockDisclosureClose,
    data: mockDisclosureData,
  }),
}));

// Holds mock citas — tests set this before rendering
let mockCitasData: Array<{
  _id: string;
  fecha: string;
  hora: string;
  estado: string;
  medico_ID: {
    _id: string;
    name: string;
    lastName: string;
    especialidad: string;
  };
  centroSalud_ID: { _id: string; nombre: string; direccion: string };
  paciente_ID: { _id: string; name: string; lastName: string };
  createdAt: string;
  updatedAt: string;
}> = [];

jest.mock('@repo/api-client', () => ({
  useCitas: () => ({
    data: mockCitasData,
    isLoading: false,
    isRefetching: false,
  }),
  useCancelCita: () => ({ mutate: jest.fn(), isPending: false }),
  useDoctors: () => ({ data: null, isLoading: false }),
  useCreateCita: () => ({ mutateAsync: jest.fn(), isPending: false }),
  useUpdateCita: () => ({ mutateAsync: jest.fn(), isPending: false }),
}));

jest.mock('@react-navigation/native', () => ({
  DrawerActions: { openDrawer: jest.fn() },
  useNavigation: () => ({ dispatch: jest.fn() }),
}));

// Mock EditCitaSheet so we can observe when it's open
jest.mock('@/src/components/ui/molecules/EditCitaSheet', () => {
  const mockReact = require('react');
  const { View, Text } = require('react-native');
  return {
    EditCitaSheet: ({ isOpen, citaId }: { isOpen: boolean; citaId: string }) =>
      isOpen
        ? mockReact.createElement(
            View,
            { testID: 'edit-cita-sheet' },
            mockReact.createElement(Text, null, `EditCitaSheet:${citaId}`),
          )
        : null,
  };
});

import AppointmentsScreen from '../index';

// Helper: build a cita
function makeCita(overrides: {
  _id?: string;
  fecha: string;
  hora: string;
  estado?: string;
}) {
  return {
    _id: overrides._id ?? 'cita-1',
    fecha: overrides.fecha,
    hora: overrides.hora,
    estado: overrides.estado ?? 'agendada',
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
  };
}

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function pastHoraToday(): string {
  // Use 00:00 if it's earlier than 2am to guarantee it's in the past today
  const now = new Date();
  if (now.getHours() >= 2) {
    const h = now.getHours() - 2;
    return `${String(h).padStart(2, '0')}:00`;
  }
  return '00:00';
}

function futureHoraToday(): string {
  const now = new Date();
  const h = now.getHours() + 2;
  if (h >= 24) return '23:59';
  return `${String(h).padStart(2, '0')}:00`;
}

function futureDateKey(): string {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

describe('AppointmentsScreen — role branching', () => {
  beforeEach(() => {
    mockRole = 'paciente';
    mockCitasData = [];
    mockDisclosureIsOpen = false;
    mockDisclosureData = null;
    mockDisclosureOpen = jest.fn();
    mockDisclosureClose = jest.fn();
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

describe('AppointmentsScreen — overdue appointment behavior', () => {
  beforeEach(() => {
    mockRole = 'paciente';
    mockDisclosureIsOpen = false;
    mockDisclosureData = null;
    mockDisclosureOpen = jest.fn();
    mockDisclosureClose = jest.fn();
  });

  it('passes isOverdue=true to AppointmentCard for an agendada cita with a past hora today', () => {
    // Use today's date with a past hora — selectedDate defaults to today so the card will render
    const fecha = todayKey();
    const hora = pastHoraToday();
    mockCitasData = [makeCita({ fecha, hora, estado: 'agendada' })];
    const { getByTestId } = render(<AppointmentsScreen />);
    // reschedule-button renders only when isOverdue=true is passed to AppointmentCard
    expect(getByTestId('reschedule-button')).toBeTruthy();
  });

  it('does NOT pass isOverdue=true for a future agendada cita (today + future hour)', () => {
    const fecha = todayKey();
    const hora = futureHoraToday();
    mockCitasData = [makeCita({ fecha, hora, estado: 'agendada' })];
    const { queryByTestId } = render(<AppointmentsScreen />);
    expect(queryByTestId('reschedule-button')).toBeNull();
  });
});

describe('AppointmentsScreen — calendar add button', () => {
  beforeEach(() => {
    mockRole = 'paciente';
    mockCitasData = [];
    mockDisclosureIsOpen = false;
    mockDisclosureData = null;
    mockDisclosureOpen = jest.fn();
    mockDisclosureClose = jest.fn();
  });

  it('"Add appointment" button exists and pressing it calls sheet.open', () => {
    const { getByTestId } = render(<AppointmentsScreen />);
    const addButton = getByTestId('calendar-add-button');
    expect(addButton).toBeTruthy();
    fireEvent.press(addButton);
    expect(mockDisclosureOpen).toHaveBeenCalledTimes(1);
  });
});

describe('AppointmentsScreen — reschedule opens EditCitaSheet', () => {
  beforeEach(() => {
    mockRole = 'paciente';
    mockDisclosureOpen = jest.fn();
    mockDisclosureClose = jest.fn();
  });

  it('EditCitaSheet renders when disclosure is open with citaId data', () => {
    const fecha = todayKey();
    const hora = pastHoraToday();
    mockCitasData = [
      makeCita({ _id: 'cita-xyz', fecha, hora, estado: 'agendada' }),
    ];
    mockDisclosureIsOpen = true;
    mockDisclosureData = { citaId: 'cita-xyz', fecha, hora };

    const { getByTestId, getByText } = render(<AppointmentsScreen />);
    expect(getByTestId('edit-cita-sheet')).toBeTruthy();
    expect(getByText('EditCitaSheet:cita-xyz')).toBeTruthy();
  });
});
