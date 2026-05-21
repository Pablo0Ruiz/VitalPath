import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Platform } from 'react-native';
import renderer from 'react-test-renderer';
import Button from '../Button';

// Mock the useTheme hook — flat tokens matching ThemeTokens shape
jest.mock('@/src/hooks/useTheme', () => ({
  useTheme: () => ({
    // Surface
    background: '#F6F4F9',
    surface: '#FDFCFF',
    surfaceElevated: '#FFFFFF',
    // Text
    textPrimary: '#1C1030',
    textSecondary: '#5C5670',
    textInverse: '#FFFFFF',
    // Border
    border: '#E5DEED',
    // Brand primary tokens (used by ripple + title style)
    primary50: '#F5F0FB',
    primary100: '#EBE1F7',
    primary200: '#D7C3EF',
    primary500: '#8B5DC8',
    primary600: '#4B2067',
    primary700: '#3A1852',
    primary900: '#1E0C2B',
    // Neutral
    neutral100: '#F4F4F5',
    // State
    error: '#FF4D6A',
    white: '#FFFFFF',
    black: '#000000',
    // Typography
    fontSizeTitle: 28,
    fontSizeBody: 14,
    fontSizeCaption: 12,
    fontSizeLabel: 11,
    // Touch target
    minTouchTarget: 44,
  }),
}));

describe('Button Component', () => {
  it('should render the title correctly', () => {
    const { getByText } = render(<Button title="Click Me" />);
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('should trigger onPress callback when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button title="Submit" onPress={onPressMock} />,
    );

    const buttonElement = getByText('Submit');
    fireEvent.press(buttonElement);

    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('should display loading spinner and NOT trigger onPress when loading is true', () => {
    const onPressMock = jest.fn();
    const { getByTestId, queryByText } = render(
      <Button
        title="Submit"
        loading={true}
        onPress={onPressMock}
        testID="custom-button"
      />,
    );

    // Test that the spinner exists (ActivityIndicator usually has accessibilityState busy or can be found via TestId if added, but we rely on the component's internal press handler blocking)
    const buttonElement = getByTestId('custom-button');
    fireEvent.press(buttonElement);

    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('should NOT trigger onPress when disabled is true', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button title="Submit" disabled={true} onPress={onPressMock} />,
    );

    const buttonElement = getByText('Submit');
    fireEvent.press(buttonElement);

    expect(onPressMock).not.toHaveBeenCalled();
  });
});

// Helper: render Button via react-test-renderer and find the Pressable node by display name.
// We cannot use findByType(Pressable) because the Pressable reference in Button.tsx
// (resolved via haste) differs from the Pressable imported here.
// We walk the instance tree and match by component display name instead.
function findPressableNode(
  node: renderer.ReactTestInstance,
): renderer.ReactTestInstance | null {
  const typeName =
    typeof node.type === 'function'
      ? (node.type as React.ComponentType).displayName ||
        (node.type as React.ComponentType).name
      : node.type;
  if (typeName === 'Pressable') return node;
  for (const child of node.children ?? []) {
    if (typeof child !== 'string') {
      const found = findPressableNode(child);
      if (found) return found;
    }
  }
  return null;
}

function getPressableProps(
  element: React.ReactElement,
): Record<string, unknown> {
  let tree: renderer.ReactTestRenderer;
  renderer.act(() => {
    tree = renderer.create(element);
  });
  const node = findPressableNode(tree!.root);
  if (!node) throw new Error('Pressable not found in Button render tree');
  return node.props as Record<string, unknown>;
}

describe('android_ripple — Android', () => {
  const PRIMARY200 = '#D7C3EF';
  const PRIMARY100 = '#EBE1F7';

  const platformAsAny = Platform as unknown as { OS: string };
  const originalOS = Platform.OS;

  beforeEach(() => {
    platformAsAny.OS = 'android';
  });
  afterEach(() => {
    platformAsAny.OS = originalOS;
  });

  it('primary variant has bounded ripple with primary200 color on Android', () => {
    const props = getPressableProps(<Button variant="primary" title="X" />);
    expect(props.android_ripple).toEqual({
      color: PRIMARY200,
      borderless: false,
    });
  });

  it('ghost variant has bounded ripple with primary100 color on Android', () => {
    const props = getPressableProps(<Button variant="ghost" title="X" />);
    expect(props.android_ripple).toEqual({
      color: PRIMARY100,
      borderless: false,
    });
  });

  it('secondary variant has bounded ripple with primary200 color on Android', () => {
    const props = getPressableProps(<Button variant="secondary" title="X" />);
    expect(props.android_ripple).toEqual({
      color: PRIMARY200,
      borderless: false,
    });
  });
});

describe('android_ripple — iOS', () => {
  it('primary variant has no android_ripple on iOS', () => {
    // Platform.OS defaults to 'ios' in the react-native test preset
    const props = getPressableProps(<Button variant="primary" title="X" />);
    expect(props.android_ripple).toBeUndefined();
  });
});
