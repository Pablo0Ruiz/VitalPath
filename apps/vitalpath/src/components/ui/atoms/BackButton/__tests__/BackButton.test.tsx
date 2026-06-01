import React from 'react';
import { render } from '@testing-library/react-native';
import renderer from 'react-test-renderer';
import BackButton from '../BackButton';

// ── Theme mock ────────────────────────────────────────────────────────────────
const MOCK_TEXT_PRIMARY = '#111827';
const MOCK_SURFACE_ELEVATED = '#FFFFFF';
const MOCK_BORDER = '#E4E7EF';

jest.mock('@/src/hooks/useTheme', () => ({
  useTheme: () => ({
    textPrimary: MOCK_TEXT_PRIMARY,
    surfaceElevated: MOCK_SURFACE_ELEVATED,
    border: MOCK_BORDER,
  }),
}));

// ── expo-router mock ──────────────────────────────────────────────────────────
jest.mock('expo-router', () => ({
  router: { back: jest.fn() },
}));

// ── Helper: walk tree to find a node by a prop value ─────────────────────────
function findNodeWithProp(
  node: renderer.ReactTestInstance,
  propName: string,
  value: unknown,
): renderer.ReactTestInstance | null {
  if (node.props[propName] === value) return node;
  for (const child of node.children ?? []) {
    if (typeof child !== 'string') {
      const found = findNodeWithProp(child, propName, value);
      if (found) return found;
    }
  }
  return null;
}

describe('BackButton — color prop', () => {
  it('uses t.textPrimary as default icon color when no color prop is passed', () => {
    let tree!: renderer.ReactTestRenderer;
    renderer.act(() => {
      tree = renderer.create(<BackButton />);
    });
    const iconWithDefault = findNodeWithProp(
      tree.root,
      'color',
      MOCK_TEXT_PRIMARY,
    );
    expect(iconWithDefault).not.toBeNull();
  });

  it('passes the custom color prop to the icon', () => {
    const CUSTOM_COLOR = '#FFFFFF';
    let tree!: renderer.ReactTestRenderer;
    renderer.act(() => {
      tree = renderer.create(<BackButton color={CUSTOM_COLOR} />);
    });
    const iconWithCustom = findNodeWithProp(tree.root, 'color', CUSTOM_COLOR);
    expect(iconWithCustom).not.toBeNull();
  });

  it('does NOT use t.textPrimary when a custom color is passed', () => {
    const CUSTOM_COLOR = '#FFFFFF';
    let tree!: renderer.ReactTestRenderer;
    renderer.act(() => {
      tree = renderer.create(<BackButton color={CUSTOM_COLOR} />);
    });
    // The chevron icon should use CUSTOM_COLOR, not the default textPrimary
    const iconWithDefault = findNodeWithProp(
      tree.root,
      'color',
      MOCK_TEXT_PRIMARY,
    );
    expect(iconWithDefault).toBeNull();
  });
});
