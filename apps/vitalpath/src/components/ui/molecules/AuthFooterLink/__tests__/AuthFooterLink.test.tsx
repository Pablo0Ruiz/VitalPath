import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AuthFooterLink } from '../AuthFooterLink';

// ── Theme mock ────────────────────────────────────────────────────────────────
jest.mock('@/src/hooks/useTheme', () => ({
  useTheme: () => ({
    textSecondary: '#6B7280',
    primary600: '#4f6ef7',
    fontSizeCaption: 13,
    minTouchTarget: 44,
  }),
}));

describe('AuthFooterLink', () => {
  it('renders prompt text and linkText', () => {
    const { getByText } = render(
      <AuthFooterLink
        text="¿No tenés cuenta?"
        linkText="Registrate"
        onPress={jest.fn()}
      />,
    );
    expect(getByText('¿No tenés cuenta?')).toBeTruthy();
    expect(getByText('Registrate')).toBeTruthy();
  });

  it('calls onPress exactly once when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <AuthFooterLink
        text="¿No tenés cuenta?"
        linkText="Registrate"
        onPress={onPress}
      />,
    );
    fireEvent.press(getByText('Registrate'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('has accessibilityRole="link" on the root touchable', () => {
    const { getByRole } = render(
      <AuthFooterLink
        text="¿No tenés cuenta?"
        linkText="Registrate"
        onPress={jest.fn()}
      />,
    );
    expect(getByRole('link')).toBeTruthy();
  });

  it('root element has minHeight >= t.minTouchTarget', () => {
    const { getByRole } = render(
      <AuthFooterLink
        text="¿No tenés cuenta?"
        linkText="Registrate"
        onPress={jest.fn()}
      />,
    );
    const root = getByRole('link');
    const style = root.props.style;
    const flatStyle = Array.isArray(style)
      ? Object.assign({}, ...(style.filter(Boolean) as object[]))
      : (style ?? {});
    expect(
      (flatStyle as { minHeight?: number }).minHeight,
    ).toBeGreaterThanOrEqual(44);
  });
});
