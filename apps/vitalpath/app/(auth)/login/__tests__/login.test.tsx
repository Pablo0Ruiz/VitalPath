import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Platform, KeyboardAvoidingView } from 'react-native';

// ── LinearGradient mock ──────────────────────────────────────────────────────
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));

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
    primary600: '#4f6ef7',
    primary700: '#3A1852',
    primary900: '#1E0C2B',
    secondary500: '#14B8A6',
    neutral100: '#F4F4F5',
    error: '#FF4D6A',
    white: '#FFFFFF',
    black: '#000000',
    fontSizeDisplay: 32,
    fontSizeTitle: 28,
    fontSizeBody: 15,
    fontSizeCaption: 13,
    fontSizeLabel: 11,
    radiusSheet: 24,
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

// ── Adapters ─────────────────────────────────────────────────────────────────
jest.mock('@/src/adapters/mobileTokenAdapter', () => ({
  mobileTokenAdapter: {},
}));

// ── Utils ────────────────────────────────────────────────────────────────────
jest.mock('@/src/utils/date', () => ({
  isElderlyUser: jest.fn(() => false),
}));

// ── Vector icons (already in moduleNameMapper but also mocked per-file) ──────
jest.mock('@expo/vector-icons/Octicons', () => 'Octicons');

// ── expo-router is mocked globally in jest.setup.js ─────────────────────────

// Import after mocks
import Login from '../index';

// ── KeyboardAvoidingView tests ───────────────────────────────────────────────
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

// ── Hero zone tests ───────────────────────────────────────────────────────────
describe('Login screen — Hero zone', () => {
  it('renders the VitalPath brand name', () => {
    const { getByText } = render(<Login />);
    expect(getByText('VitalPath')).toBeTruthy();
  });

  it('renders the "Tus datos, protegidos" trust chip', () => {
    const { getByText } = render(<Login />);
    expect(getByText('Tus datos, protegidos')).toBeTruthy();
  });

  it('renders the "Uso médico verificado" trust chip', () => {
    const { getByText } = render(<Login />);
    expect(getByText('Uso médico verificado')).toBeTruthy();
  });
});

// ── Form card tests ───────────────────────────────────────────────────────────
describe('Login screen — Form card', () => {
  it('renders the email input label', () => {
    const { getByText } = render(<Login />);
    expect(getByText('Correo electrónico')).toBeTruthy();
  });

  it('renders the password input label', () => {
    const { getByText } = render(<Login />);
    expect(getByText('Contraseña')).toBeTruthy();
  });

  it('renders the primary "Iniciar sesión" button', () => {
    const { getByText } = render(<Login />);
    expect(getByText('Iniciar sesión')).toBeTruthy();
  });
});

// ── Disclosure toggle tests ───────────────────────────────────────────────────
describe('Login screen — Senior code disclosure', () => {
  it('code section is hidden by default', () => {
    const { queryByText } = render(<Login />);
    expect(queryByText('Código de acceso senior')).toBeNull();
  });

  it('disclosure toggle button is visible', () => {
    const { getByText } = render(<Login />);
    expect(getByText('¿Usás código de acceso?')).toBeTruthy();
  });

  it('tapping disclosure toggle reveals code section', () => {
    const { getByText } = render(<Login />);
    const toggle = getByText('¿Usás código de acceso?');
    fireEvent.press(toggle);
    expect(getByText('Código de acceso senior')).toBeTruthy();
  });

  it('tapping disclosure toggle twice hides code section again', () => {
    const { getByText, queryByText } = render(<Login />);
    const toggle = getByText('¿Usás código de acceso?');
    fireEvent.press(toggle);
    fireEvent.press(toggle);
    expect(queryByText('Código de acceso senior')).toBeNull();
  });
});

// ── Footer links tests ────────────────────────────────────────────────────────
describe('Login screen — Footer links', () => {
  it('renders the registration link', () => {
    const { getByText } = render(<Login />);
    expect(getByText('Registrate')).toBeTruthy();
  });

  it('renders the cuidador link', () => {
    const { getByText } = render(<Login />);
    expect(getByText('Registrate acá')).toBeTruthy();
  });
});
