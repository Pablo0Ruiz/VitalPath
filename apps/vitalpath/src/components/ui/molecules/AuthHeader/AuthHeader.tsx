import { Image, StyleSheet, View, ViewProps } from 'react-native';
import { TextField } from '../../atoms';
import { GradientHero } from '../../atoms/GradientHero';
import { useTheme } from '@/src/hooks/useTheme';

interface AuthHeaderProps extends ViewProps {
  title: string;
  subtitle?: string;
}

const AuthHeader = ({ title, subtitle, style }: AuthHeaderProps) => {
  const t = useTheme();

  return (
    <View style={style}>
      <GradientHero size="short" style={s.hero}>
        <View style={s.heroContent}>
          <Image
            source={require('@/assets/images/new-logo.png')}
            style={s.logo}
            resizeMode="contain"
          />
          <TextField variant="caption" style={s.tagline}>
            Tu salud, en un solo lugar
          </TextField>
        </View>
      </GradientHero>

      <View style={s.header}>
        <TextField variant="title" style={{ color: t.textPrimary }}>
          {title}
        </TextField>

        {subtitle && (
          <TextField
            variant="caption"
            style={[s.subtitle, { color: t.textSecondary }]}
          >
            {subtitle}
          </TextField>
        )}
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  hero: { marginBottom: 24 },
  heroContent: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 64, height: 64, marginBottom: 12 },
  tagline: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    textAlign: 'center',
  },
  header: { paddingHorizontal: 20 },
  subtitle: { fontSize: 14, marginBottom: 32 },
});

export default AuthHeader;
