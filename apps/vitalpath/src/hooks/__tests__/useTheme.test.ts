jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
  default: jest.fn(() => 'light'),
}));

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(() => Promise.resolve(null)),
  setItemAsync: jest.fn(() => Promise.resolve()),
  deleteItemAsync: jest.fn(() => Promise.resolve()),
}));

let mockIsSeniorUI = false;
let mockHasHydrated = true;

jest.mock('@/src/stores/seniorUI.store', () => ({
  useSeniorUIStore: (
    selector?: (state: {
      isSeniorUI: boolean;
      _hasHydrated: boolean;
    }) => unknown,
  ) => {
    const state = { isSeniorUI: mockIsSeniorUI, _hasHydrated: mockHasHydrated };
    return selector ? selector(state) : state;
  },
}));

import { renderHook } from '@testing-library/react-native';
import { act } from '@testing-library/react-native';

const getHook = () => require('../useTheme').useTheme;

describe('useTheme — reference stability (PERF-B2-01)', () => {
  beforeEach(() => {
    mockIsSeniorUI = false;
    mockHasHydrated = true;
    jest.resetModules();
  });

  it('returns same object reference across two renders when isSeniorUI is unchanged (base path)', () => {
    const useTheme = require('../useTheme').useTheme;
    const { result, rerender } = renderHook(() => useTheme());

    const first = result.current;
    rerender({});
    const second = result.current;

    expect(Object.is(first, second)).toBe(true);
  });

  it('returns same object reference across two renders when isSeniorUI=true (senior path)', () => {
    mockIsSeniorUI = true;
    jest.resetModules();
    const useTheme = require('../useTheme').useTheme;
    const { result, rerender } = renderHook(() => useTheme());

    const first = result.current;
    rerender({});
    const second = result.current;

    expect(Object.is(first, second)).toBe(true);
  });
});

describe('useTheme — new reference on isSeniorUI toggle (PERF-B2-02)', () => {
  it('returns new object reference when isSeniorUI toggles from false to true', () => {
    mockIsSeniorUI = false;
    mockHasHydrated = true;
    jest.resetModules();

    const useTheme = require('../useTheme').useTheme;
    const { result, rerender } = renderHook(() => useTheme());

    const before = result.current;
    const beforeFontSize = (before as { fontSizeBody: number }).fontSizeBody;

    act(() => {
      mockIsSeniorUI = true;
    });
    rerender({});

    const after = result.current;
    const afterFontSize = (after as { fontSizeBody: number }).fontSizeBody;

    expect(Object.is(before, after)).toBe(false);
    expect(afterFontSize).toBeGreaterThan(beforeFontSize);
  });
});
