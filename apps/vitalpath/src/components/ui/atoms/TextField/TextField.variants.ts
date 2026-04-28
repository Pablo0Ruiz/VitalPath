import { StyleSheet, TextStyle } from 'react-native';

export type TextFieldVariant =
  | 'title'
  | 'subtitle'
  | 'body'
  | 'caption'
  | 'label';

export const textFieldStyles = StyleSheet.create<
  Record<TextFieldVariant, TextStyle>
>({
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#475569',
    lineHeight: 34,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#94A3B8',
    textAlign: 'left',
  },
  body: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    textAlign: 'left',
  },
  caption: {
    fontSize: 12,
    fontWeight: '500',
    color: '#0F172A',
    textAlign: 'left',
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: '#0F172A',
    textAlign: 'left',
  },
});
