import { StyleSheet, View, ViewProps } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Button, TextField } from '@/src/components/ui/atoms';
import { useTheme } from '@/src/hooks/useTheme';

export interface SecurityBannerProps extends ViewProps {
  onMorePress?: () => void;
}

const SecurityBanner = ({
  onMorePress,
  style,
  ...props
}: SecurityBannerProps) => {
  const t = useTheme();

  return (
    <View
      style={[s.container, { backgroundColor: t.neutral950 }, style]}
      {...props}
    >
      <View style={[s.iconWrapper, { backgroundColor: t.neutral800 }]}>
        <Feather name="lock" size={20} color={t.white} />
      </View>
      <View style={s.content}>
        <TextField variant="body" style={[s.title, { color: t.white }]}>
          Seguridad de Nivel Médico
        </TextField>
        <TextField
          variant="caption"
          style={[s.description, { color: t.neutral400 }]}
        >
          Tus resultados están protegidos mediante cifrado AES-256 de extremo a
          extremo. Solo tú y tu médico tratante pueden acceder a esta
          información.
        </TextField>
        <Button onPress={onMorePress} variant="ghost" style={s.button}>
          <TextField variant="caption" style={[s.link, { color: t.info }]}>
            Más sobre privacidad →
          </TextField>
        </Button>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  iconWrapper: { borderRadius: 12, padding: 10, marginTop: 4 },
  content: { flex: 1 },
  title: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 4,
    textAlign: 'left',
  },
  description: {
    lineHeight: 20,
    marginBottom: 12,
    textAlign: 'left',
    fontSize: 13,
  },
  button: { padding: 0, alignSelf: 'flex-start' },
  link: { fontWeight: '600', fontSize: 13 },
});

export default SecurityBanner;
