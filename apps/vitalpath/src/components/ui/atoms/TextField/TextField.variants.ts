import { TextStyle } from 'react-native';
import { ThemeTokens } from '@/src/constants/tokens';

export type TextFieldVariant =
  | 'title'
  | 'subtitle'
  | 'body'
  | 'caption'
  | 'label';

export const getTextFieldStyle = (
  variant: TextFieldVariant,
  t: ThemeTokens,
): TextStyle => {
  const styles: Record<TextFieldVariant, TextStyle> = {
    title: {
      fontSize: t.fontSizeTitle,
      fontWeight: '700',
      color: t.textPrimary,
      lineHeight: t.fontSizeTitle * 1.2,
      textAlign: 'left',
    },
    subtitle: {
      fontSize: t.fontSizeBody,
      fontWeight: '400',
      color: t.textSecondary,
      textAlign: 'left',
    },
    body: {
      fontSize: t.fontSizeBody,
      fontWeight: '600',
      color: t.textPrimary,
      textAlign: 'left',
    },
    caption: {
      fontSize: t.fontSizeCaption,
      fontWeight: '500',
      color: t.textSecondary,
      textAlign: 'left',
    },
    label: {
      fontSize: t.fontSizeLabel,
      fontWeight: '700',
      letterSpacing: 1.5,
      textTransform: 'uppercase',
      color: t.textPrimary,
      textAlign: 'left',
    },
  };
  return styles[variant];
};
