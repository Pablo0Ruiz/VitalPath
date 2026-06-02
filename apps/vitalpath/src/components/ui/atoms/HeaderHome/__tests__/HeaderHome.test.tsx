import React from 'react';
import { render } from '@testing-library/react-native';
import HeaderHome from '../HeaderHome';

// ── Theme mock ────────────────────────────────────────────────────────────────
const MOCK_THEME = {
  background: '#F5F7FC',
  surface: '#FFFFFF',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  border: '#E4E7EF',
  fontSizeTitle: 24,
  fontSizeBody: 15,
  fontSizeCaption: 13,
  fontSizeLabel: 11,
  radiusSheet: 24,
  minTouchTarget: 44,
  online: '#22C55E',
  primary600: '#4f6ef7',
};

jest.mock('@/src/hooks/useTheme', () => ({
  useTheme: () => MOCK_THEME,
}));

// Mock UserAvatar to avoid complex dependency chains
jest.mock('@/src/components/ui/atoms/UserAvatar/UserAvatar', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: ({ testID }: { testID?: string }) =>
      React.createElement(View, { testID: testID ?? 'user-avatar' }),
  };
});

/** Recursively flattens nested style arrays into a single object (last-wins). */
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

describe('HeaderHome', () => {
  it('renders greeting label text', () => {
    const { getByText } = render(
      <HeaderHome textLabel="Welcome back" nameUser="Ana" />,
    );
    expect(getByText('Welcome back')).toBeTruthy();
  });

  it('renders user name', () => {
    const { getByText } = render(
      <HeaderHome textLabel="Hola" nameUser="Carlos" />,
    );
    expect(getByText('Carlos')).toBeTruthy();
  });

  it('name text uses t.fontSizeBody not literal 15', () => {
    const { UNSAFE_getAllByType } = render(
      <HeaderHome textLabel="Hola" nameUser="Carlos" />,
    );
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Text } = require('react-native');
    const textNodes = UNSAFE_getAllByType(Text);
    const nameNode = textNodes.find((n: { props: { children: unknown } }) => {
      const c = n.props.children;
      return Array.isArray(c) ? c.includes('Carlos') : c === 'Carlos';
    });
    expect(nameNode).toBeTruthy();
    const flat = flattenStyle(nameNode!.props.style);
    expect(flat.fontSize).toBe(MOCK_THEME.fontSizeBody);
  });

  it('label text uses t.fontSizeLabel not literal 12', () => {
    const { UNSAFE_getAllByType } = render(
      <HeaderHome textLabel="Welcome back" nameUser="Ana" />,
    );
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Text } = require('react-native');
    const textNodes = UNSAFE_getAllByType(Text);
    const labelNode = textNodes.find((n: { props: { children: unknown } }) => {
      const c = n.props.children;
      return Array.isArray(c)
        ? c.includes('Welcome back')
        : c === 'Welcome back';
    });
    expect(labelNode).toBeTruthy();
    const flat = flattenStyle(labelNode!.props.style);
    expect(flat.fontSize).toBe(MOCK_THEME.fontSizeLabel);
  });
});
