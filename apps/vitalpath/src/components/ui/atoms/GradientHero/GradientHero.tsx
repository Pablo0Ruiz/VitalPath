import { StyleSheet, View, ViewProps, useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  gradientHeroSizeStyles,
  type GradientHeroSize,
} from './GradientHero.variants';

const LIGHT_STOPS: readonly [string, string, string] = [
  '#4F6EF7',
  '#9B5DE5',
  '#14B8A6',
];
const DARK_STOPS: readonly [string, string, string] = [
  '#7B8FFA',
  '#B87AF8',
  '#2DD4BF',
];

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
        <View style={s.glassOverlay} />
        {children}
      </LinearGradient>
    </View>
  );
};

const s = StyleSheet.create({
  base: { width: '100%', overflow: 'hidden' },
  gradient: { flex: 1 },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
});

export default GradientHero;
