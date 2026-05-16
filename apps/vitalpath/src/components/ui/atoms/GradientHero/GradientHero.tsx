import { StyleSheet, View, ViewProps, useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  gradientHeroSizeStyles,
  type GradientHeroSize,
} from './GradientHero.variants';

const LIGHT_STOPS = ['#4B2067', '#3A1852', '#1E0C2B'] as const;
const DARK_STOPS = ['#EED88E', '#D4A843', '#A67B27'] as const;

export interface GradientHeroProps extends ViewProps {
  size?: GradientHeroSize;
  children?: React.ReactNode;
}

const GradientHero = ({
  size = 'tall',
  style,
  children,
  ...props
}: GradientHeroProps) => {
  const colorScheme = useColorScheme();
  const stops = colorScheme === 'dark' ? DARK_STOPS : LIGHT_STOPS;

  return (
    <View style={[s.base, gradientHeroSizeStyles[size], style]} {...props}>
      <LinearGradient
        colors={stops}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={s.gradient}
      >
        {children}
      </LinearGradient>
    </View>
  );
};

const s = StyleSheet.create({
  base: { width: '100%', overflow: 'hidden' },
  gradient: { flex: 1 },
});

export default GradientHero;
