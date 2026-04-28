import { StyleSheet, View, ViewProps } from 'react-native';
import { Button, TextField } from '../../atoms';
import { useTheme } from '@/src/hooks/useTheme';

export interface SectionHeaderProps extends ViewProps {
  title: string;
  linkLabel?: string;
  onLinkPress?: () => void;
}

const SectionHeader = ({
  title,
  linkLabel,
  onLinkPress,
  style,
  ...props
}: SectionHeaderProps) => {
  const t = useTheme();

  return (
    <View style={[s.container, style]} {...props}>
      <TextField variant="body" style={[s.title, { color: t.textPrimary }]}>
        {title}
      </TextField>
      {linkLabel && onLinkPress && (
        <Button
          onPress={onLinkPress}
          variant="ghost"
          size="sm"
          style={s.button}
        >
          <TextField
            variant="caption"
            style={[s.link, { color: t.primary700 }]}
          >
            {linkLabel}
          </TextField>
        </Button>
      )}
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 4,
  },
  title: { fontSize: 17, fontWeight: '700', textAlign: 'left' },
  button: { padding: 0 },
  link: { fontWeight: '600', fontSize: 13 },
});

export default SectionHeader;
