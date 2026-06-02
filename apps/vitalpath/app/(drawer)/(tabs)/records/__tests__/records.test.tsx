import React from 'react';
import { render } from '@testing-library/react-native';

// ── Theme ────────────────────────────────────────────────────────────────────
jest.mock('@/src/hooks/useTheme', () => ({
  useTheme: () => ({
    background: '#F5F7FC',
    surface: '#FFFFFF',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    border: '#E4E7EF',
    primary600: '#4f6ef7',
  }),
}));

// ── Auth store ───────────────────────────────────────────────────────────────
jest.mock('@/src/stores/auth', () => ({
  useAuthStore: () => ({ user: { _id: 'user-1', name: 'Test' } }),
}));

// ── Controlled data ───────────────────────────────────────────────────────────
let mockResultados: any = [];
let mockCitas: any = [];
let mockIsLoading = false;

jest.mock('@repo/api-client', () => ({
  useMedicalResultsPaciente: () => ({
    data: mockResultados,
    isLoading: mockIsLoading,
    refetch: jest.fn(),
    isFetching: false,
  }),
  useCitas: () => ({
    data: mockCitas,
    isLoading: false,
    refetch: jest.fn(),
    isFetching: false,
  }),
}));

// ── Organisms ────────────────────────────────────────────────────────────────
jest.mock('@/src/components/ui/organisms', () => {
  const { View } = require('react-native');
  const React = require('react');
  return {
    ScreenLayout: ({
      children,
      scrollable,
    }: {
      children: React.ReactNode;
      scrollable?: any;
    }) =>
      React.createElement(
        View,
        { testID: 'screen-layout', 'data-scrollable': String(scrollable) },
        children,
      ),
  };
});

// ── Atoms ────────────────────────────────────────────────────────────────────
jest.mock('@/src/components/ui/atoms', () => {
  const { View, Text } = require('react-native');
  const React = require('react');
  return {
    EmptyState: () => React.createElement(View, { testID: 'empty-state' }),
    LoadingScreen: () =>
      React.createElement(View, { testID: 'loading-screen' }),
    ScreenHeader: ({ title }: { title: string }) =>
      React.createElement(Text, { testID: 'screen-header' }, title),
  };
});

// ── StudyCard ─────────────────────────────────────────────────────────────────
jest.mock('@/src/components/ui/molecules/StudyCard', () => {
  const { View } = require('react-native');
  const React = require('react');
  return {
    StudyCard: ({ study }: { study: any }) =>
      React.createElement(View, { testID: 'study-card-' + study._id }),
  };
});

import RecordsScreen from '../index';

function makeResult(id: string) {
  return {
    _id: id,
    cita_ID: {
      _id: 'cita-' + id,
      fecha: '2025-06-01',
      hora: '09:00',
      estado: 'completada',
    },
    medico_ID: null,
    paciente_ID: null,
    fileUrl: '',
    createdAt: '2025-06-01',
    updatedAt: '2025-06-01',
  };
}

describe('RecordsScreen (PR4)', () => {
  beforeEach(() => {
    mockResultados = [];
    mockCitas = [];
    mockIsLoading = false;
  });

  it('renders ScreenLayout with scrollable=false', () => {
    const { getByTestId } = render(<RecordsScreen />);
    const layout = getByTestId('screen-layout');
    expect(layout.props['data-scrollable']).toBe('false');
  });

  it('renders LoadingScreen during initial load', () => {
    mockIsLoading = true;
    mockResultados = undefined;
    const { getByTestId } = render(<RecordsScreen />);
    expect(getByTestId('loading-screen')).toBeTruthy();
  });

  it('renders EmptyState when no data', () => {
    const { getByTestId } = render(<RecordsScreen />);
    expect(getByTestId('empty-state')).toBeTruthy();
  });

  it('renders a StudyCard for each result', () => {
    mockResultados = [makeResult('r1'), makeResult('r2')];
    const { getByTestId } = render(<RecordsScreen />);
    expect(getByTestId('study-card-r1')).toBeTruthy();
    expect(getByTestId('study-card-r2')).toBeTruthy();
  });

  it('renders ScreenHeader with title "Análisis"', () => {
    const { getByText } = render(<RecordsScreen />);
    expect(getByText('Análisis')).toBeTruthy();
  });
});
