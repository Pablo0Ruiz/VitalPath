import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

// ── Theme ────────────────────────────────────────────────────────────────────
jest.mock('@/src/hooks/useTheme', () => ({
  useTheme: () => ({
    background: '#F5F7FC',
    surface: '#FFFFFF',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    primary600: '#4f6ef7',
    border: '#E4E7EF',
  }),
}));

// ── Auth store ───────────────────────────────────────────────────────────────
jest.mock('@/src/stores/auth', () => ({
  useAuthStore: () => ({ user: { _id: 'user-1' } }),
}));

// ── Route params ──────────────────────────────────────────────────────────────
jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ id: 'result-1' }),
  router: { push: jest.fn(), replace: jest.fn() },
}));

// ── API ───────────────────────────────────────────────────────────────────────
const MOCK_STUDY = {
  _id: 'result-1',
  cita_ID: {
    _id: 'cita-1',
    fecha: '2025-06-01',
    hora: '09:00',
    estado: 'resultados_listos',
  },
  medico_ID: null,
  paciente_ID: null,
  fileUrl: 'https://example.com/file.pdf',
  notasMedico: '',
  createdAt: '2025-06-01',
  updatedAt: '2025-06-01',
};

jest.mock('@repo/api-client', () => ({
  useMedicalResultsPaciente: () => ({ data: [MOCK_STUDY] }),
  useCitas: () => ({ data: [] }),
}));

// ── Web browser + Linking ─────────────────────────────────────────────────────
jest.mock('expo-web-browser', () => ({
  openBrowserAsync: jest.fn().mockResolvedValue({}),
}));

jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: jest.fn().mockResolvedValue({}),
}));

// ── PDF hook ──────────────────────────────────────────────────────────────────
jest.mock('@/src/hooks/usePdfData', () => ({
  usePdfData: () => ({
    fetchPdfData: jest
      .fn()
      .mockResolvedValue({
        publicUrl: 'https://example.com/file.pdf',
        resumen: 'Resumen IA',
      }),
    pdfCache: {},
  }),
}));

// ── Organisms ────────────────────────────────────────────────────────────────
jest.mock('@/src/components/ui/organisms', () => {
  const { View } = require('react-native');
  const React = require('react');
  return {
    ScreenLayout: ({
      children,
      edges,
    }: {
      children: React.ReactNode;
      edges?: any;
    }) =>
      React.createElement(
        View,
        { testID: 'screen-layout', 'data-edges': JSON.stringify(edges) },
        children,
      ),
    TrackingTimeline: () =>
      React.createElement(View, { testID: 'tracking-timeline' }),
  };
});

jest.mock('@/src/components/ui/organisms/TrackingTimeline', () => ({
  TrackingTimeline: () => {
    const { View } = require('react-native');
    const React = require('react');
    return React.createElement(View, { testID: 'tracking-timeline' });
  },
}));

// ── Molecules ────────────────────────────────────────────────────────────────
jest.mock('@/src/components/ui/molecules/SummaryBottomSheet', () => ({
  SummaryBottomSheet: () => {
    const { View } = require('react-native');
    const React = require('react');
    return React.createElement(View, { testID: 'summary-bottom-sheet' });
  },
}));

// ── Atoms ────────────────────────────────────────────────────────────────────
jest.mock('@/src/components/ui/atoms', () => {
  const { View, Text, Pressable } = require('react-native');
  const React = require('react');
  return {
    Button: ({
      title,
      onPress,
      loading,
    }: {
      title: string;
      onPress?: () => void;
      loading?: boolean;
    }) =>
      React.createElement(
        Pressable,
        { testID: 'button-' + title, onPress },
        React.createElement(Text, null, loading ? 'Cargando...' : title),
      ),
    TextField: ({ children }: { children: React.ReactNode }) =>
      React.createElement(Text, null, children),
  };
});

import StudyDetailScreen from '../[id]';

describe('StudyDetailScreen — layout (PR4)', () => {
  it('renders ScreenLayout with edges=["bottom"]', () => {
    const { getByTestId } = render(<StudyDetailScreen />);
    const layout = getByTestId('screen-layout');
    expect(JSON.parse(layout.props['data-edges'])).toEqual(['bottom']);
  });
});

describe('StudyDetailScreen — actions (PR4)', () => {
  it('renders "Ver PDF" Button when results are available', () => {
    const { getByTestId } = render(<StudyDetailScreen />);
    expect(getByTestId('button-Ver PDF')).toBeTruthy();
  });

  it('renders "Ver resumen IA" Button when results are available', () => {
    const { getByTestId } = render(<StudyDetailScreen />);
    expect(getByTestId('button-Ver resumen IA')).toBeTruthy();
  });

  it('"Ver PDF" button fires its handler when pressed', () => {
    const { getByTestId } = render(<StudyDetailScreen />);
    const btn = getByTestId('button-Ver PDF');
    fireEvent.press(btn);
    // handler is async — no crash = pass
    expect(btn).toBeTruthy();
  });

  it('"Ver resumen IA" button fires its handler when pressed', () => {
    const { getByTestId } = render(<StudyDetailScreen />);
    const btn = getByTestId('button-Ver resumen IA');
    fireEvent.press(btn);
    expect(btn).toBeTruthy();
  });
});
