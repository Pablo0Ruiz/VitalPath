import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import renderer from 'react-test-renderer';
import SectionHeader from '../SectionHeader';

jest.mock('@/src/hooks/useTheme', () => ({
  useTheme: () => ({
    textPrimary: '#1C1030',
    primary600: '#4B2067',
    primary700: '#3A1852',
    textInverse: '#FFFFFF',
    fontSizeBody: 14,
    fontSizeCaption: 12,
    minTouchTarget: 44,
    fontSizeTitle: 28,
    fontSizeLabel: 11,
    white: '#FFFFFF',
    error: '#FF4D6A',
    primary100: '#EBE1F7',
    primary200: '#D7C3EF',
  }),
}));

// Helper: walk react-test-renderer tree and find a node by display name
function findNodeByName(
  node: renderer.ReactTestInstance,
  name: string,
): renderer.ReactTestInstance | null {
  const typeName =
    typeof node.type === 'function'
      ? (node.type as React.ComponentType).displayName ||
        (node.type as React.ComponentType).name
      : node.type;
  if (typeName === name) return node;
  for (const child of node.children ?? []) {
    if (typeof child !== 'string') {
      const found = findNodeByName(child, name);
      if (found) return found;
    }
  }
  return null;
}

// Find all nodes matching a name
function findAllNodesByName(
  node: renderer.ReactTestInstance,
  name: string,
): renderer.ReactTestInstance[] {
  const results: renderer.ReactTestInstance[] = [];
  const typeName =
    typeof node.type === 'function'
      ? (node.type as React.ComponentType).displayName ||
        (node.type as React.ComponentType).name
      : node.type;
  if (typeName === name) results.push(node);
  for (const child of node.children ?? []) {
    if (typeof child !== 'string') {
      results.push(...findAllNodesByName(child, name));
    }
  }
  return results;
}

describe('SectionHeader — ghost link hit area', () => {
  const EXPECTED_HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };
  const onLinkPressMock = jest.fn();

  beforeEach(() => {
    onLinkPressMock.mockClear();
  });

  it('ghost link Button has hitSlop = { top: 8, bottom: 8, left: 8, right: 8 }', () => {
    let tree: renderer.ReactTestRenderer;
    renderer.act(() => {
      tree = renderer.create(
        <SectionHeader
          title="Citas"
          linkLabel="Ver todas"
          onLinkPress={onLinkPressMock}
        />,
      );
    });

    // Find the Button component (ghost variant) in the SectionHeader tree
    const buttonNodes = findAllNodesByName(tree!.root, 'Button');
    // The ghost link is the only Button in SectionHeader when linkLabel is provided
    expect(buttonNodes.length).toBeGreaterThan(0);
    const linkButton = buttonNodes[0];
    expect(linkButton.props.hitSlop).toEqual(EXPECTED_HIT_SLOP);
  });

  it('ghost link touch target meets minimum 44dp (hitSlop extends reach by 8+8=16dp vertically)', () => {
    let tree: renderer.ReactTestRenderer;
    renderer.act(() => {
      tree = renderer.create(
        <SectionHeader
          title="Citas"
          linkLabel="Ver todas"
          onLinkPress={onLinkPressMock}
        />,
      );
    });

    const buttonNodes = findAllNodesByName(tree!.root, 'Button');
    const linkButton = buttonNodes[0];
    const hitSlop = linkButton.props.hitSlop as { top: number; bottom: number };

    // sm size Button has minHeight: 40dp; with 8+8 hitSlop = 56dp effective touch target >= 44dp
    expect(hitSlop.top).toBeGreaterThanOrEqual(8);
    expect(hitSlop.bottom).toBeGreaterThanOrEqual(8);
  });

  it('onLinkPress fires when ghost link Button is pressed', () => {
    const { getByText } = render(
      <SectionHeader
        title="Citas"
        linkLabel="Ver todas"
        onLinkPress={onLinkPressMock}
      />,
    );

    fireEvent.press(getByText('Ver todas'));
    expect(onLinkPressMock).toHaveBeenCalledTimes(1);
  });

  it('does not render link Button when linkLabel is absent', () => {
    let tree: renderer.ReactTestRenderer;
    renderer.act(() => {
      tree = renderer.create(<SectionHeader title="Citas" />);
    });

    const buttonNodes = findAllNodesByName(tree!.root, 'Button');
    expect(buttonNodes.length).toBe(0);
  });
});
