import React from 'react';
import { Text, ScrollView, View } from 'react-native';
import { render } from '@testing-library/react-native';
import { ScreenLayout } from '../ScreenLayout';

// ── Theme mock ────────────────────────────────────────────────────────────────
const MOCK_THEME = {
  background: '#F5F7FC',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textInverse: '#FFFFFF',
  border: '#E4E7EF',
  primary600: '#4f6ef7',
  fontSizeTitle: 24,
  fontSizeBody: 15,
  fontSizeCaption: 13,
  fontSizeLabel: 11,
  radiusSheet: 24,
  minTouchTarget: 44,
};

jest.mock('@/src/hooks/useTheme', () => ({
  useTheme: () => MOCK_THEME,
}));

// ── expo-linear-gradient mock ─────────────────────────────────────────────────
jest.mock('expo-linear-gradient', () => {
  const { View } = require('react-native');
  const React = require('react');
  return {
    LinearGradient: ({ children, ...props }: React.PropsWithChildren<object>) =>
      React.createElement(
        View,
        { testID: 'linear-gradient', ...props },
        children,
      ),
  };
});

// ── useColorScheme mock ───────────────────────────────────────────────────────
jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
  default: () => 'light',
}));

// ── react-native-safe-area-context mock ───────────────────────────────────────
jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  const React = require('react');
  return {
    SafeAreaView: ({
      children,
      edges,
      ...props
    }: React.PropsWithChildren<{ edges?: string[] }>) =>
      React.createElement(
        View,
        {
          testID: 'safe-area-view',
          'data-edges': JSON.stringify(edges),
          ...props,
        },
        children,
      ),
    useSafeAreaInsets: () => ({ top: 44, bottom: 0, left: 0, right: 0 }),
  };
});

describe('ScreenLayout', () => {
  it('showHero=true renders GradientHero (testID="gradient-hero")', () => {
    const { getByTestId } = render(
      <ScreenLayout showHero>
        <Text>Child</Text>
      </ScreenLayout>,
    );
    expect(getByTestId('gradient-hero')).toBeTruthy();
  });

  it('showHero=false does NOT render GradientHero', () => {
    const { queryByTestId } = render(
      <ScreenLayout showHero={false}>
        <Text>Child</Text>
      </ScreenLayout>,
    );
    expect(queryByTestId('gradient-hero')).toBeNull();
  });

  it('scrollable=false renders a View wrapper, not a ScrollView, around children', () => {
    const { getByTestId, UNSAFE_queryAllByType } = render(
      <ScreenLayout scrollable={false}>
        <Text testID="inner-child">Content</Text>
      </ScreenLayout>,
    );
    expect(getByTestId('inner-child')).toBeTruthy();
    const scrollViews = UNSAFE_queryAllByType(ScrollView);
    expect(scrollViews).toHaveLength(0);
  });

  it('scrollable=true (default) renders a ScrollView', () => {
    const { UNSAFE_getAllByType } = render(
      <ScreenLayout>
        <Text>Content</Text>
      </ScreenLayout>,
    );
    const scrollViews = UNSAFE_getAllByType(ScrollView);
    expect(scrollViews.length).toBeGreaterThan(0);
  });

  it('isSenior=true applies paddingHorizontal multiplied by 1.4 vs default', () => {
    const BASE_PAD = 24;
    const { getByTestId: getDefault } = render(
      <ScreenLayout>
        <Text>Default</Text>
      </ScreenLayout>,
    );
    const { getByTestId: getSenior } = render(
      <ScreenLayout isSenior>
        <Text>Senior</Text>
      </ScreenLayout>,
    );

    const defaultCard = getDefault('screen-layout-card');
    const seniorCard = getSenior('screen-layout-card');

    const flatDefault = flattenStyle(defaultCard.props.style);
    const flatSenior = flattenStyle(seniorCard.props.style);

    expect(flatDefault.paddingHorizontal).toBe(BASE_PAD);
    expect(flatSenior.paddingHorizontal).toBe(Math.round(BASE_PAD * 1.4));
  });

  it('edges prop is forwarded to SafeAreaView', () => {
    const customEdges = ['bottom'];
    const { getByTestId } = render(
      <ScreenLayout edges={customEdges as ['bottom']}>
        <Text>Child</Text>
      </ScreenLayout>,
    );
    const sav = getByTestId('safe-area-view');
    const forwarded = JSON.parse(sav.props['data-edges'] ?? '[]') as string[];
    // When showHero=false (default), 'top' should be included from the default edges,
    // but when we pass custom edges they should be forwarded as-is
    expect(forwarded).toContain('bottom');
  });
});

/** Recursively flatten style arrays into a single object (last-wins). */
function flattenStyle(style: unknown): Record<string, unknown> {
  if (!style) return {};
  if (Array.isArray(style)) {
    return style.reduce<Record<string, unknown>>(
      (acc, s) => ({ ...acc, ...flattenStyle(s) }),
      {},
    );
  }
  if (typeof style === 'object') return style as Record<string, unknown>;
  return {};
}
