/**
 * Tests for RootLayout splash gate logic.
 *
 * SplashScreen is mocked via jest so hideAsync() calls are captured.
 * We use jest.useFakeTimers() to drive timeout-based state transitions.
 */
import React from 'react';
import { act, render } from '@testing-library/react-native';

// ── expo-splash-screen ────────────────────────────────────────────────────────
// Factory is hoisted — define functions inline so they are always initialized.
jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn().mockResolvedValue(undefined),
  hideAsync: jest.fn().mockResolvedValue(undefined),
}));

// ── expo-font ─────────────────────────────────────────────────────────────────
// mockUseFonts is a jest.fn() created in the factory — allowed by jest hoisting
// rules because it starts with 'mock'.
const mockUseFonts = jest.fn(() => [false, null] as [boolean, Error | null]);

jest.mock('expo-font', () => ({
  useFonts: (..._args: unknown[]) => mockUseFonts(),
  loadAsync: jest.fn(),
  isLoaded: jest.fn().mockReturnValue(true),
}));

// ── expo-status-bar ───────────────────────────────────────────────────────────
jest.mock('expo-status-bar', () => ({
  StatusBar: () => null,
}));

// ── @sentry/react-native ──────────────────────────────────────────────────────
jest.mock('@sentry/react-native', () => ({
  init: jest.fn(),
  wrap: (component: React.ComponentType) => component,
  setUser: jest.fn(),
}));

// ── @tanstack/react-query ─────────────────────────────────────────────────────
jest.mock('@tanstack/react-query', () => {
  const { View } = require('react-native');
  const React = require('react');
  return {
    QueryClient: jest.fn().mockImplementation(() => ({})),
    QueryClientProvider: ({ children }: React.PropsWithChildren<object>) =>
      React.createElement(View, null, children),
    focusManager: { setFocused: jest.fn() },
  };
});

// ── expo-router Stack ─────────────────────────────────────────────────────────
jest.mock('expo-router', () => {
  const { View } = require('react-native');
  const React = require('react');
  const StackScreen = () => null;
  const Stack = ({ children }: React.PropsWithChildren<object>) =>
    React.createElement(View, { testID: 'stack' }, children);
  Stack.Screen = StackScreen;
  return {
    Stack,
    router: { push: jest.fn(), replace: jest.fn(), back: jest.fn() },
    useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
    useLocalSearchParams: () => ({}),
    useSegments: () => [],
    Link: 'Link',
  };
});

// ── stores & hooks ────────────────────────────────────────────────────────────
jest.mock('@/src/stores/auth', () => ({
  useAuthStore: () => ({
    user: null,
    setSession: jest.fn(),
    clearSession: jest.fn(),
    setIsLoading: jest.fn(),
    _hasHydrated: true,
    persist: { onFinishHydration: jest.fn(() => jest.fn()) },
  }),
}));

jest.mock('@/src/stores/seniorUI.store', () => ({
  useSeniorUIStore: () => ({
    syncWithUser: jest.fn(),
    reset: jest.fn(),
    _hasHydrated: true,
  }),
}));

jest.mock('@/src/hooks/useTheme', () => ({
  useTheme: () => ({
    background: '#FFFFFF',
    textPrimary: '#000000',
  }),
}));

// ── repo packages ─────────────────────────────────────────────────────────────
jest.mock('@repo/api-client', () => ({
  useSession: jest.fn(),
  useVersionCheck: jest.fn(() => ({ isLoading: false, isBlocked: false })),
}));

jest.mock('@/src/adapters/mobileTokenAdapter', () => ({
  mobileTokenAdapter: {},
}));

jest.mock('@/src/lib/api-setup', () => ({
  setupApiInterceptors: jest.fn(),
}));

// ── VersionGate — immediately calls onResolved so version gate unblocks ───────
jest.mock('@/src/components/ui/organisms/VersionGate', () => {
  const React = require('react');
  return {
    VersionGate: ({
      children,
      onResolved,
    }: {
      children: React.ReactNode;
      onResolved?: () => void;
    }) => {
      React.useEffect(() => {
        onResolved?.();
      }, [onResolved]);
      return React.createElement(React.Fragment, null, children);
    },
  };
});

// ── Import component AND SplashScreen mock AFTER all jest.mock declarations ──
import RootLayout from '../_layout';
import * as SplashScreen from 'expo-splash-screen';

describe('RootLayout — splash gate', () => {
  let mockHideAsync: jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    // Access the mock function from the auto-mocked module
    mockHideAsync = SplashScreen.hideAsync as jest.Mock;
    mockHideAsync.mockClear();
    mockUseFonts.mockReturnValue([false, null]);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders without crashing when fonts are loading (returns null)', () => {
    mockUseFonts.mockReturnValue([false, null]);
    const { toJSON } = render(<RootLayout />);
    // When fontsReady is false, component returns null
    expect(toJSON()).toBeNull();
  });

  it('renders without crashing and mounts tree when fonts are loaded', () => {
    mockUseFonts.mockReturnValue([true, null]);
    const { toJSON } = render(<RootLayout />);
    expect(toJSON()).not.toBeNull();
  });

  it('renders without crashing and mounts tree when fonts error', () => {
    mockUseFonts.mockReturnValue([false, new Error('font load failed')]);
    const { toJSON } = render(<RootLayout />);
    expect(toJSON()).not.toBeNull();
  });

  it('calls hideAsync when fonts are ready and version resolves', () => {
    mockUseFonts.mockReturnValue([true, null]);

    render(<RootLayout />);

    act(() => {
      jest.runAllTimers();
    });

    expect(mockHideAsync).toHaveBeenCalled();
  });

  it('does NOT call hideAsync while font gate has not opened', () => {
    // Fonts still loading, no timeout fired yet
    mockUseFonts.mockReturnValue([false, null]);

    render(<RootLayout />);

    act(() => {
      // Advance 1 second — font timeout is 3000ms, has not fired yet
      jest.advanceTimersByTime(1000);
    });

    expect(mockHideAsync).not.toHaveBeenCalled();
  });

  it('calls hideAsync via font timeout after 3000ms when fonts stall', () => {
    mockUseFonts.mockReturnValue([false, null]);

    render(<RootLayout />);

    // Fire the 3000ms font timeout — fontsReady flips to true
    // VersionGate mock calls onResolved immediately on mount
    // → versionDone becomes true → appReady flips → hideAsync fires
    act(() => {
      jest.advanceTimersByTime(3100);
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(mockHideAsync).toHaveBeenCalled();
  });
});
