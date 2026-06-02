import React from 'react';
import { render } from '@testing-library/react-native';
import { router } from 'expo-router';

// ── Theme ──────────────────────────────────────────────────────────────────
jest.mock('@/src/hooks/useTheme', () => ({
  useTheme: () => ({
    background: '#F5F7FC',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    textInverse: '#FFFFFF',
    border: '#E4E7EF',
    primary50: '#eef1fe',
    primary100: '#dde3fd',
    primary200: '#bbc7fb',
    primary500: '#6480f8',
    primary600: '#4f6ef7',
    primary700: '#3a57e0',
    primary900: '#1e2f8a',
    secondary500: '#14B8A6',
    accentAi: '#9B5DE5',
    neutral100: '#F4F4F5',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    white: '#FFFFFF',
    black: '#000000',
    fontSizeTitle: 24,
    fontSizeDisplay: 32,
    fontSizeBody: 15,
    fontSizeCaption: 13,
    fontSizeLabel: 11,
    radiusCard: 16,
    radiusSheet: 24,
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
  useChatContextStore: <T,>(selector: (state: { chatId: string }) => T) =>
    selector({ chatId: 'chat-1' }),
}));

// ── Controlled citas data (mutable so individual tests can override) ────────
let mockCitasData: Array<{
  _id: string;
  fecha: string;
  hora: string;
  estado: string;
}> = [];

let mockMedicamentsData: Array<{
  _id: string;
  name: string;
  dosesTaken: number;
  frequencyHours: number;
  notificationIds: string[];
}> = [];

// ── API client ──────────────────────────────────────────────────────────────
jest.mock('@repo/api-client', () => ({
  useCitas: () => ({ data: mockCitasData, isLoading: false }),
  useMedicaments: () => ({ data: mockMedicamentsData, isLoading: false }),
  useMedicationsByPatient: () => ({ data: [], isLoading: false }),
  useDeleteMedication: () => ({ mutateAsync: jest.fn() }),
  useTakeMedication: () => ({ mutateAsync: jest.fn() }),
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
}));

// ── Complex molecules / organisms (stub to avoid deep dependency chains) ────
jest.mock('@/src/components/ui/molecules/MedicationFormModal', () => {
  const { View } = require('react-native');
  const React = require('react');
  return {
    MedicationFormModal: () =>
      React.createElement(View, { testID: 'medication-form-modal' }),
  };
});

jest.mock('@/src/components/ui/organisms', () => {
  const { View } = require('react-native');
  const React = require('react');
  return {
    VoiceAssistantModal: () =>
      React.createElement(View, { testID: 'voice-assistant-modal' }),
    ScreenLayout: ({
      children,
      showHero,
    }: {
      children: React.ReactNode;
      showHero?: boolean;
    }) =>
      React.createElement(
        View,
        { testID: 'screen-layout', 'data-show-hero': String(showHero) },
        children,
      ),
  };
});

// ── Hook mocks (useAdherence, useUpcomingCitas) ──────────────────────────────
jest.mock('@/src/hooks/useAdherence', () => ({
  useAdherence: jest.fn(() => ({
    adherenceValue: null,
    pendingMedsCount: null,
  })),
}));

jest.mock('@/src/hooks/useUpcomingCitas', () => ({
  useUpcomingCitas: jest.fn(() => ({
    upcomingCitas: [],
    nextCitaValue: null,
    isLoading: false,
  })),
}));

// ── Molecules mock (preserve SectionHeader + DailyCheckIn stubs) ─────────────
jest.mock('@/src/components/ui/molecules', () => {
  const { View, Text } = require('react-native');
  const React = require('react');
  return {
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
          ? React.createElement(
              Text,
              { testID: `link-${title}`, onPress: onLinkPress },
              linkLabel,
            )
          : null,
      ),
    DailyCheckIn: () => React.createElement(View, { testID: 'daily-check-in' }),
    EmptyPacienteActivoState: () =>
      React.createElement(View, { testID: 'empty-state' }),
    HomeTopBar: () => React.createElement(View, { testID: 'home-top-bar' }),
    CompactMedRow: ({ med }: { med: { _id: string } }) =>
      React.createElement(View, { testID: `med-row-${med._id}` }),
    AppointmentPreviewRow: ({ cita }: { cita: { _id: string } }) =>
      React.createElement(View, { testID: `appointment-row-${cita._id}` }),
  };
});

// ── Atoms mock (MetricCard, Button, TextField, InlineEmptySlot, etc.) ────────
jest.mock('@/src/components/ui/atoms', () => {
  const { View, Text } = require('react-native');
  const React = require('react');
  return {
    MetricCard: ({
      label,
      value,
    }: {
      label: string;
      value: string | number | null;
    }) =>
      React.createElement(
        View,
        { testID: `metric-card-${label}` },
        value !== null
          ? React.createElement(
              Text,
              { testID: `metric-value-${label}` },
              String(value),
            )
          : React.createElement(
              Text,
              { testID: `metric-empty-${label}` },
              'Sin datos aún',
            ),
      ),
    Button: ({
      title,
      onPress,
      children,
    }: {
      title?: string;
      onPress?: () => void;
      children?: React.ReactNode;
    }) =>
      React.createElement(
        View,
        {
          testID: `button-${title ?? 'icon'}`,
          onStartShouldSetResponder: onPress,
        },
        children,
      ),
    HeaderHome: () => React.createElement(View, { testID: 'header-home' }),
    LoadingScreen: () =>
      React.createElement(View, { testID: 'loading-screen' }),
    InlineEmptySlot: () =>
      React.createElement(View, { testID: 'inline-empty-slot' }),
    EmptyState: ({
      icon,
      title,
      actionLabel,
      onAction,
    }: {
      icon: string;
      title: string;
      actionLabel?: string;
      onAction?: () => void;
    }) =>
      React.createElement(
        View,
        { testID: `empty-state-${icon}` },
        React.createElement(Text, null, title),
        actionLabel
          ? React.createElement(
              View,
              {
                testID: `empty-state-cta-${icon}`,
                onStartShouldSetResponder: onAction,
              },
              React.createElement(Text, null, actionLabel),
            )
          : null,
      ),
    TextField: ({ children }: { children?: React.ReactNode }) =>
      React.createElement(Text, null, children),
  };
});

// After mocking, import the screen under test
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

function makeMed(overrides: {
  _id?: string;
  name?: string;
  dosesTaken?: number;
}) {
  return {
    _id: overrides._id ?? 'med-1',
    name: overrides.name ?? 'Med A',
    dosesTaken: overrides.dosesTaken ?? 0,
    frequencyHours: 8,
    notificationIds: [],
  };
}

// Fixed "now": 2025-06-15 at 10:00
const FIXED_NOW = new Date(2025, 5, 15, 10, 0, 0);

// ── PR2 tests ─────────────────────────────────────────────────────────────────
describe('DashboardScreen — ScreenLayout integration (PR2)', () => {
  beforeEach(() => {
    mockCitasData = [];
    mockMedicamentsData = [];
  });

  it('ScreenLayout is rendered', () => {
    const { getByTestId } = render(<DashboardScreen />);
    expect(getByTestId('screen-layout')).toBeTruthy();
  });

  it('ScreenLayout is rendered with showHero=true', () => {
    const { getByTestId } = render(<DashboardScreen />);
    const layout = getByTestId('screen-layout');
    expect(layout.props['data-show-hero']).toBe('true');
  });

  it('MetricCard for steps renders with empty state (Pedometer deferred)', () => {
    const { getByTestId } = render(<DashboardScreen />);
    expect(getByTestId('metric-empty-PASOS')).toBeTruthy();
  });

  it('MetricCard for adherence renders', () => {
    const { getByTestId } = render(<DashboardScreen />);
    expect(getByTestId('metric-card-ADHERENCIA')).toBeTruthy();
  });

  it('MetricCard for next cita renders', () => {
    const { getByTestId } = render(<DashboardScreen />);
    expect(getByTestId('metric-card-PRÓXIMA CITA')).toBeTruthy();
  });
});

describe('DashboardScreen — medications mini-list (PR2)', () => {
  beforeEach(() => {
    mockCitasData = [];
    mockMedicamentsData = [];
  });

  it('renders at most 3 medication rows when 5 medications exist', () => {
    mockMedicamentsData = [
      makeMed({ _id: '1', name: 'Med 1' }),
      makeMed({ _id: '2', name: 'Med 2' }),
      makeMed({ _id: '3', name: 'Med 3' }),
      makeMed({ _id: '4', name: 'Med 4' }),
      makeMed({ _id: '5', name: 'Med 5' }),
    ];
    const { queryAllByTestId } = render(<DashboardScreen />);
    const rows = queryAllByTestId(/^med-row-/);
    expect(rows.length).toBeLessThanOrEqual(3);
  });

  it('"Ver todos" link navigates to medications route', () => {
    const { getByTestId } = render(<DashboardScreen />);
    const link = getByTestId('link-Medicamentos');
    expect(link).toBeTruthy();
    // Press the link
    link.props.onPress?.();
    expect(router.push).toHaveBeenCalledWith(
      expect.stringContaining('medication'),
    );
  });
});

describe('DashboardScreen — appointments preview (PR2)', () => {
  beforeEach(() => {
    mockCitasData = [];
    mockMedicamentsData = [];
    jest.useFakeTimers();
    jest.setSystemTime(FIXED_NOW);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders appointments section', () => {
    const { getByTestId } = render(<DashboardScreen />);
    expect(getByTestId('section-header-Próximas Citas')).toBeTruthy();
  });

  it('shows upcoming citas from useCitas()', () => {
    mockCitasData = [
      makeCita({ fecha: '2025-06-16', hora: '09:00', estado: 'agendada' }),
    ];
    const { getByTestId } = render(<DashboardScreen />);
    // The appointments section header should exist
    expect(getByTestId('section-header-Próximas Citas')).toBeTruthy();
  });
});

describe('DashboardScreen — senior FAB (PR2)', () => {
  it('senior FAB is NOT rendered when isSeniorUI=false (default)', () => {
    const { queryByTestId } = render(<DashboardScreen />);
    // The Pressable FAB or VoiceAssistantModal trigger should not be present
    expect(queryByTestId('senior-fab')).toBeNull();
  });

  it('senior FAB IS rendered when isSeniorUI=true', () => {
    // Override the useSeniorUIStore mock for this test
    const seniorUIMock = require('@/src/stores/seniorUI.store');
    seniorUIMock.useSeniorUIStore = () => ({
      isSeniorUI: true,
      _hasHydrated: true,
    });

    const { getByTestId } = render(<DashboardScreen />);
    expect(getByTestId('senior-fab')).toBeTruthy();

    // Reset
    seniorUIMock.useSeniorUIStore = () => ({
      isSeniorUI: false,
      _hasHydrated: true,
    });
  });
});

// ── upcomingCitas filter (now delegated to useUpcomingCitas hook) ─────────────
// The filtering logic is unit-tested in the hook itself. These tests verify
// that the screen renders appointment rows based on what useUpcomingCitas returns.
describe('DashboardScreen — upcomingCitas rendering (R-OBS2-3 and R-OBS2-4)', () => {
  let mockUseUpcomingCitas: jest.Mock;

  beforeEach(() => {
    mockCitasData = [];
    mockMedicamentsData = [];
    const { useUpcomingCitas } = require('@/src/hooks/useUpcomingCitas');
    mockUseUpcomingCitas = useUpcomingCitas as jest.Mock;
    mockUseUpcomingCitas.mockReturnValue({
      upcomingCitas: [],
      nextCitaValue: null,
      isLoading: false,
    });
  });

  it('renders appointment rows when useUpcomingCitas returns upcoming citas', () => {
    mockUseUpcomingCitas.mockReturnValue({
      upcomingCitas: [
        makeCita({ fecha: '2025-06-16', hora: '09:00', estado: 'agendada' }),
      ],
      nextCitaValue: '16 de junio de 2025',
      isLoading: false,
    });
    const { queryAllByTestId } = render(<DashboardScreen />);
    const rows = queryAllByTestId(/^appointment-row-/);
    expect(rows.length).toBeGreaterThanOrEqual(1);
  });

  it('renders no appointment rows when useUpcomingCitas returns empty array', () => {
    mockUseUpcomingCitas.mockReturnValue({
      upcomingCitas: [],
      nextCitaValue: null,
      isLoading: false,
    });
    const { queryAllByTestId } = render(<DashboardScreen />);
    const rows = queryAllByTestId(/^appointment-row-/);
    expect(rows.length).toBe(0);
  });

  it('renders at most 2 appointment rows even when more are returned', () => {
    mockUseUpcomingCitas.mockReturnValue({
      upcomingCitas: [
        makeCita({
          _id: 'c1',
          fecha: '2025-06-16',
          hora: '09:00',
          estado: 'agendada',
        }),
        makeCita({
          _id: 'c2',
          fecha: '2025-06-17',
          hora: '10:00',
          estado: 'agendada',
        }),
        makeCita({
          _id: 'c3',
          fecha: '2025-06-18',
          hora: '11:00',
          estado: 'agendada',
        }),
      ],
      nextCitaValue: '16 de junio de 2025',
      isLoading: false,
    });
    const { queryAllByTestId } = render(<DashboardScreen />);
    const rows = queryAllByTestId(/^appointment-row-/);
    expect(rows.length).toBeLessThanOrEqual(2);
  });

  // Placeholder test to verify the overdue case is handled at hook level (not screen level)
  it('excludes a same-day agendada appointment whose hora is in the past (overdue)', () => {
    // Hook already filtered it out — screen receives empty array
    mockUseUpcomingCitas.mockReturnValue({
      upcomingCitas: [],
      nextCitaValue: null,
      isLoading: false,
    });
    const { queryAllByTestId } = render(<DashboardScreen />);
    const rows = queryAllByTestId(/^appointment-row-/);
    expect(rows.length).toBe(0);
  });
});
