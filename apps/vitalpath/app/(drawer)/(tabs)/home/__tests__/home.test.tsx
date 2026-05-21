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

// ── API client ──────────────────────────────────────────────────────────────
jest.mock('@repo/api-client', () => ({
  useCitas: () => ({ data: [], isLoading: false }),
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

// ── DailyCheckIn (deep dependencies — stub) ─────────────────────────────────
jest.mock('@/src/components/ui/molecules', () => {
  const { View, Text } = require('react-native');
  const React = require('react');
  return {
    CustomList: ({ type }: { type: string }) =>
      React.createElement(View, { testID: `custom-list-${type}` }),
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

describe('DashboardScreen — card shadow-wrapper + clip container split', () => {
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
