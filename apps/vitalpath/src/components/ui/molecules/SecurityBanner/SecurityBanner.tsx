import { StyleSheet, View, ViewProps, useColorScheme } from 'react-native';
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
  const isDark = useColorScheme() === 'dark';

  const bannerBg = isDark ? t.surfaceElevated : t.primary50;
  const iconBg = isDark ? 'rgba(123,143,250,0.15)' : t.primary100;
  const iconColor = isDark ? t.primary500 : t.primary600;

  return (
    <View
      style={[
        s.container,
        {
          backgroundColor: bannerBg,
          borderColor: isDark ? t.border : t.glassBorder,
        },
        style,
      ]}
      {...props}
    >
      <View style={[s.iconWrapper, { backgroundColor: iconBg }]}>
        <Feather name="lock" size={20} color={iconColor} />
      </View>
      <View style={s.content}>
        <TextField variant="body" style={[s.title, { color: t.textPrimary }]}>
          Tus resultados son privados
        </TextField>
        <TextField
          variant="caption"
          style={[s.description, { color: t.textSecondary }]}
        >
          Cifrado de grado médico. Solo vos y tu médico pueden acceder a esta
          información.
        </TextField>
        <Button onPress={onMorePress} variant="ghost" style={s.button}>
          <TextField
            variant="caption"
            style={[s.link, { color: t.primary600 }]}
          >
            Más sobre privacidad →
          </TextField>
        </Button>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderWidth: 1,
  },
  iconWrapper: { borderRadius: 10, padding: 10, marginTop: 2 },
  content: { flex: 1 },
  title: {
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'left',
  },
  description: {
    lineHeight: 20,
    marginBottom: 10,
    textAlign: 'left',
  },
  button: { padding: 0, alignSelf: 'flex-start' },
  link: { fontWeight: '600' },
});

export default SecurityBanner;
