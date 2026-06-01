import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import TextField from '@/src/components/ui/atoms/TextField/TextField';
import { useTheme } from '@/src/hooks/useTheme';

export interface AuthFooterLinkProps {
  text: string;
  linkText: string;
  onPress: () => void;
}

export const AuthFooterLink = ({
  text,
  linkText,
  onPress,
}: AuthFooterLinkProps) => {
  const t = useTheme();

  return (
    <TouchableOpacity
      accessibilityRole="link"
      onPress={onPress}
      style={[s.root, { minHeight: t.minTouchTarget }]}
    >
      <TextField
        variant="caption"
        style={{ color: t.textSecondary, fontSize: t.fontSizeCaption }}
      >
        {text}
      </TextField>
      <TextField
        variant="caption"
        style={{
          color: t.primary600,
          fontWeight: '700',
          fontSize: t.fontSizeCaption,
        }}
      >
        {linkText}
      </TextField>
    </TouchableOpacity>
  );
};

const s = StyleSheet.create({
  root: {
    alignSelf: 'center',
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
