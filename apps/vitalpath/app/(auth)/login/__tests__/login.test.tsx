import React from 'react';
import { render } from '@testing-library/react-native';
import { Platform, KeyboardAvoidingView } from 'react-native';

// ── Theme ────────────────────────────────────────────────────────────────────
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

// ── API client ───────────────────────────────────────────────────────────────
jest.mock('@repo/api-client', () => ({
  useLogin: () => ({ mutate: jest.fn(), isPending: false }),
  useLoginWithCode: () => ({ mutate: jest.fn(), isPending: false }),
}));

// ── Auth store ───────────────────────────────────────────────────────────────
jest.mock('@/src/stores/auth', () => ({
  useAuthStore: () => ({ setSession: jest.fn() }),
}));

// ── Senior UI store ──────────────────────────────────────────────────────────
jest.mock('@/src/stores/seniorUI.store', () => ({
  useSeniorUIStore: () => ({ hasSeenSuggestion: false }),
}));

// ── Vector icons (already in moduleNameMapper but also mocked per-file) ──────
jest.mock('@expo/vector-icons/Octicons', () => 'Octicons');

// ── expo-router is mocked globally in jest.setup.js ─────────────────────────

// Import after mocks
import Login from '../index';

describe('Login screen — KeyboardAvoidingView', () => {
  it('renders a KeyboardAvoidingView in the tree', () => {
    const { UNSAFE_getByType } = render(<Login />);
    expect(UNSAFE_getByType(KeyboardAvoidingView)).toBeTruthy();
  });

  it('KeyboardAvoidingView has behavior="padding" on iOS', () => {
    const originalOS = Platform.OS;
    (Platform as unknown as { OS: string }).OS = 'ios';

    const { UNSAFE_getByType } = render(<Login />);
    const kav = UNSAFE_getByType(KeyboardAvoidingView);
    expect(kav.props.behavior).toBe('padding');

    (Platform as unknown as { OS: string }).OS = originalOS;
  });

  it('KeyboardAvoidingView has behavior="height" on Android', () => {
    const originalOS = Platform.OS;
    (Platform as unknown as { OS: string }).OS = 'android';

    const { UNSAFE_getByType } = render(<Login />);
    const kav = UNSAFE_getByType(KeyboardAvoidingView);
    expect(kav.props.behavior).toBe('height');

    (Platform as unknown as { OS: string }).OS = originalOS;
  });
});
