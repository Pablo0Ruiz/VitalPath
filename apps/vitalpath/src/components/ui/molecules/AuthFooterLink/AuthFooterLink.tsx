import { StyleSheet } from 'react-native';
import { Button, TextField } from '@/src/components/ui/atoms';
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
    <Button
      variant="ghost"
      accessibilityRole="link"
      onPress={onPress}
      style={s.root}
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
    </Button>
  );
};

const s = StyleSheet.create({
  root: {
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 4,
  },
});
