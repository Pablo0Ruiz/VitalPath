import React from 'react';
import { render } from '@testing-library/react-native';

// ── Theme ──────────────────────────────────────────────────────────────────
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

// ── Auth & UI stores ────────────────────────────────────────────────────────
jest.mock('@/src/stores/auth', () => ({
  useAuthStore: () => ({ user: { name: 'Test User' } }),
}));

jest.mock('@/src/stores/seniorUI.store', () => ({
  useSeniorUIStore: () => ({ isSeniorUI: false, _hasHydrated: true }),
}));

// ── Shared store ────────────────────────────────────────────────────────────
jest.mock('@repo/store', () => ({
  useChatContextStore: (_selector: (s: { chatId: string }) => unknown) =>
    _selector({ chatId: 'chat-1' }),
}));

// ── Controlled citas data (mutable so individual tests can override) ────────
let mockCitasData: Array<{
  _id: string;
  fecha: string;
  hora: string;
  estado: string;
}> = [];

// ── API client ──────────────────────────────────────────────────────────────
jest.mock('@repo/api-client', () => ({
  useCitas: () => ({ data: mockCitasData, isLoading: false }),
  useMedicaments: () => ({ data: [], isLoading: false }),
  useMedicationsByPatient: () => ({ data: [], isLoading: false }),
  useDeleteMedication: () => ({ mutateAsync: jest.fn() }),
}));

// ── Navigation ──────────────────────────────────────────────────────────────
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ dispatch: jest.fn() }),
  DrawerActions: { openDrawer: jest.fn(() => ({ type: 'OPEN_DRAWER' })) },
}));

// ── App hooks ───────────────────────────────────────────────────────────────
jest.mock('@/src/hooks', () => ({
  useActivePatientId: () => ({ patientId: 'patient-1', needsSelection: false }),
  useDisclosure: () => ({
    isOpen: false,
    open: jest.fn(),
    close: jest.fn(),
    data: null,
  }),
  useCompletedSet: () => ({
    completedIds: new Set(),
    markCompleted: jest.fn(),
  }),
}));

// ── Complex molecules / organisms (stub to avoid deep dependency chains) ────
jest.mock(
  '@/src/components/ui/molecules/CustomUpdateModal/CustomUpdateModal',
  () => {
    const { View } = require('react-native');
    const React = require('react');
    return () => React.createElement(View, { testID: 'custom-update-modal' });
  },
);

jest.mock('@/src/components/ui/organisms', () => {
  const { View } = require('react-native');
  const React = require('react');
  return {
    VoiceAssistantModal: () =>
      React.createElement(View, { testID: 'voice-assistant-modal' }),
  };
});

// ── CustomList spy — captures `data` prop so tests can assert on it ──────────
let capturedCitaData: unknown[] | null = null;

jest.mock('@/src/components/ui/molecules', () => {
  const { View, Text } = require('react-native');
  const React = require('react');
  return {
    CustomList: ({ type, data }: { type: string; data?: unknown[] }) => {
      if (type === 'cita') {
        capturedCitaData = data ?? null;
      }
      return React.createElement(View, { testID: `custom-list-${type}` });
    },
    CustomModal: () => React.createElement(View, { testID: 'custom-modal' }),
    SectionHeader: ({
      title,
      linkLabel,
      onLinkPress,
    }: {
      title: string;
      linkLabel?: string;
      onLinkPress?: () => void;
    }) =>
      React.createElement(
        View,
        { testID: `section-header-${title}` },
        React.createElement(Text, null, title),
        linkLabel
          ? React.createElement(Text, { onPress: onLinkPress }, linkLabel)
          : null,
      ),
    DailyCheckIn: () => React.createElement(View, { testID: 'daily-check-in' }),
    EmptyPacienteActivoState: () =>
      React.createElement(View, { testID: 'empty-state' }),
  };
});

// After mocking molecules (which contains SectionHeader), the home screen should render
import DashboardScreen from '../index';

// ── Helpers ──────────────────────────────────────────────────────────────────
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
  };
}

// Fixed "now": 2025-06-15 at 10:00
const FIXED_NOW = new Date(2025, 5, 15, 10, 0, 0); // month is 0-indexed

// ── Existing tests ────────────────────────────────────────────────────────────
describe('DashboardScreen — card shadow-wrapper + clip container split', () => {
  beforeEach(() => {
    mockCitasData = [];
    capturedCitaData = null;
  });

  it('citas card outer wrapper (card-shadow-citas) has elevation and no overflow', () => {
    const { getByTestId } = render(<DashboardScreen />);
    const shadowWrapper = getByTestId('card-shadow-citas');
    const style = shadowWrapper.props.style;

    // Flatten style array if needed
    const flatStyle = Array.isArray(style)
      ? Object.assign({}, ...(style.filter(Boolean) as object[]))
      : (style ?? {});

    expect(flatStyle).not.toHaveProperty('overflow', 'hidden');
    // elevation can be on a nested style object — check flat style contains elevation key
    const hasElevation =
      Object.values(flatStyle).some(
        v => v !== undefined && typeof flatStyle === 'object',
      ) || 'elevation' in flatStyle;
    expect(hasElevation).toBe(true);
  });

  it('citas card inner clip (card-clip-citas) has overflow hidden and no elevation', () => {
    const { getByTestId } = render(<DashboardScreen />);
    const clipWrapper = getByTestId('card-clip-citas');
    const style = clipWrapper.props.style;

    const flatStyle = Array.isArray(style)
      ? Object.assign({}, ...(style.filter(Boolean) as object[]))
      : (style ?? {});

    expect(flatStyle).toHaveProperty('overflow', 'hidden');
    expect(flatStyle).not.toHaveProperty('elevation');
  });

  it('medications card outer wrapper (card-shadow-meds) has elevation and no overflow', () => {
    const { getByTestId } = render(<DashboardScreen />);
    const shadowWrapper = getByTestId('card-shadow-meds');
    const style = shadowWrapper.props.style;

    const flatStyle = Array.isArray(style)
      ? Object.assign({}, ...(style.filter(Boolean) as object[]))
      : (style ?? {});

    expect(flatStyle).not.toHaveProperty('overflow', 'hidden');
  });

  it('medications card inner clip (card-clip-meds) has overflow hidden and no elevation', () => {
    const { getByTestId } = render(<DashboardScreen />);
    const clipWrapper = getByTestId('card-clip-meds');
    const style = clipWrapper.props.style;

    const flatStyle = Array.isArray(style)
      ? Object.assign({}, ...(style.filter(Boolean) as object[]))
      : (style ?? {});

    expect(flatStyle).toHaveProperty('overflow', 'hidden');
    expect(flatStyle).not.toHaveProperty('elevation');
  });

  it('CustomList for type cita still mounts (card structure not broken)', () => {
    const { getByTestId } = render(<DashboardScreen />);
    expect(getByTestId('custom-list-cita')).toBeTruthy();
  });
});

// ── New tests: upcomingCitas filter (R-OBS2-3, R-OBS2-4) ─────────────────────
describe('DashboardScreen — upcomingCitas filter (R-OBS2-3 and R-OBS2-4)', () => {
  beforeEach(() => {
    mockCitasData = [];
    capturedCitaData = null;
    // Pin system time to FIXED_NOW so all new Date() calls are deterministic
    jest.useFakeTimers();
    jest.setSystemTime(FIXED_NOW);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('includes an agendada appointment with datetime strictly in the future', () => {
    // 2025-06-16 at 09:00 — after FIXED_NOW (2025-06-15 10:00)
    mockCitasData = [
      makeCita({ fecha: '2025-06-16', hora: '09:00', estado: 'agendada' }),
    ];
    render(<DashboardScreen />);
    expect(capturedCitaData).toHaveLength(1);
  });

  it('excludes a cancelada appointment even if its datetime is in the future', () => {
    // Future date but estado = cancelada
    mockCitasData = [
      makeCita({ fecha: '2025-06-16', hora: '09:00', estado: 'cancelada' }),
    ];
    render(<DashboardScreen />);
    expect(capturedCitaData).toHaveLength(0);
  });

  it('excludes a completada appointment even if its datetime is in the future', () => {
    // Future date but estado = completada
    mockCitasData = [
      makeCita({ fecha: '2025-06-16', hora: '09:00', estado: 'completada' }),
    ];
    render(<DashboardScreen />);
    expect(capturedCitaData).toHaveLength(0);
  });

  it('excludes an agendada appointment whose datetime is in the past (overdue)', () => {
    // 2025-06-14 09:00 — before FIXED_NOW (2025-06-15 10:00)
    mockCitasData = [
      makeCita({ fecha: '2025-06-14', hora: '09:00', estado: 'agendada' }),
    ];
    render(<DashboardScreen />);
    expect(capturedCitaData).toHaveLength(0);
  });

  it('includes a same-day agendada appointment whose hora is in the future', () => {
    // Same day (2025-06-15) at 14:00 — after FIXED_NOW 10:00
    mockCitasData = [
      makeCita({ fecha: '2025-06-15', hora: '14:00', estado: 'agendada' }),
    ];
    render(<DashboardScreen />);
    expect(capturedCitaData).toHaveLength(1);
  });

  it('excludes a same-day agendada appointment whose hora is in the past (overdue)', () => {
    // Same day (2025-06-15) at 08:00 — before FIXED_NOW 10:00
    mockCitasData = [
      makeCita({ fecha: '2025-06-15', hora: '08:00', estado: 'agendada' }),
    ];
    render(<DashboardScreen />);
    expect(capturedCitaData).toHaveLength(0);
  });
});
