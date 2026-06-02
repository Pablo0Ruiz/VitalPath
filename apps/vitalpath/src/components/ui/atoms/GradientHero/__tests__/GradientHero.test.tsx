import React from 'react';
import { render } from '@testing-library/react-native';
import GradientHero from '../GradientHero';

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

describe('GradientHero', () => {
  it('size="tall" renders height 256', () => {
    const { getByTestId } = render(<GradientHero size="tall" testID="hero" />);
    const hero = getByTestId('hero');
    const flat = flattenStyle(hero.props.style);
    expect(flat.height).toBe(256);
  });

  it('size="short" renders height 160', () => {
    const { getByTestId } = render(<GradientHero size="short" testID="hero" />);
    const hero = getByTestId('hero');
    const flat = flattenStyle(hero.props.style);
    expect(flat.height).toBe(160);
  });

  it('size="card" renders height 128', () => {
    const { getByTestId } = render(<GradientHero size="card" testID="hero" />);
    const hero = getByTestId('hero');
    const flat = flattenStyle(hero.props.style);
    expect(flat.height).toBe(128);
  });

  it('size="banner" renders height 160', () => {
    const { getByTestId } = render(
      <GradientHero size="banner" testID="hero" />,
    );
    const hero = getByTestId('hero');
    const flat = flattenStyle(hero.props.style);
    expect(flat.height).toBe(160);
  });

  it('size="banner" renders borderBottomLeftRadius 20 and borderBottomRightRadius 20', () => {
    const { getByTestId } = render(
      <GradientHero size="banner" testID="hero" />,
    );
    const hero = getByTestId('hero');
    const flat = flattenStyle(hero.props.style);
    expect(flat.borderBottomLeftRadius).toBe(20);
    expect(flat.borderBottomRightRadius).toBe(20);
  });

  it('renders children', () => {
    const { getByTestId } = render(
      <GradientHero size="tall">
        <React.Fragment>
          {/* @ts-ignore */}
          <React.Fragment testID="hero-child" />
        </React.Fragment>
      </GradientHero>,
    );
    // Just verify render does not throw with children
    expect(getByTestId('linear-gradient')).toBeTruthy();
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
