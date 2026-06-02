import React from 'react';
import { render } from '@testing-library/react-native';
import ScreenHeader from '../ScreenHeader';

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
};

jest.mock('@/src/hooks/useTheme', () => ({
  useTheme: () => MOCK_THEME,
}));

describe('ScreenHeader', () => {
  it('renders title text', () => {
    const { getByText } = render(<ScreenHeader title="My Title" />);
    expect(getByText('My Title')).toBeTruthy();
  });

  it('renders subtitle when provided', () => {
    const { getByText } = render(<ScreenHeader title="Title" subtitle="Sub" />);
    expect(getByText('Sub')).toBeTruthy();
  });

  it('does not render subtitle when omitted', () => {
    const { queryByText } = render(<ScreenHeader title="Title" />);
    expect(queryByText('Sub')).toBeNull();
  });

  it('title uses t.fontSizeTitle (24) not literal 30', () => {
    const { UNSAFE_getAllByType } = render(<ScreenHeader title="Test" />);
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Text } = require('react-native');
    const textNodes = UNSAFE_getAllByType(Text);
    // Find Text node whose children prop contains "Test"
    const titleNode = textNodes.find((n: { props: { children: unknown } }) => {
      const c = n.props.children;
      return Array.isArray(c) ? c.includes('Test') : c === 'Test';
    });
    expect(titleNode).toBeTruthy();
    // Flatten style array and assert fontSize is the token value (24), NOT 30
    const rawStyle = titleNode!.props.style;
    const styles: object[] = Array.isArray(rawStyle)
      ? rawStyle
      : [rawStyle ?? {}];
    const flatStyle = Object.assign({}, ...styles);
    expect(flatStyle.fontSize).not.toBe(30);
    expect(flatStyle.fontSize).toBe(MOCK_THEME.fontSizeTitle);
  });
});
