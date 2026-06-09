import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  useReducedMotion,
  cancelAnimation,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { useTheme } from '@/src/hooks/useTheme';

const AnimatedView = Animated.createAnimatedComponent(View);

const DOTS = [0, 150, 300] as const;

interface DotItemProps {
  delay: number;
  color: string;
  reduced: boolean;
  index: number;
}

const DotItem = ({ delay, color, reduced, index }: DotItemProps) => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    if (reduced) return;
    opacity.value = withRepeat(
      withDelay(
        delay,
        withSequence(
          withTiming(1, { duration: 400 }),
          withTiming(0.3, { duration: 400 }),
        ),
      ),
      -1,
      false,
    );
    return () => cancelAnimation(opacity);
  }, [reduced, delay]);

  const style = useAnimatedStyle(() => ({
    opacity: reduced ? 0.6 : opacity.value,
  }));

  return (
    <AnimatedView
      testID={`thinking-dot-${index}`}
      style={[s.dot, { backgroundColor: color }, style]}
    />
  );
};

const ThinkingIndicator = () => {
  const t = useTheme();
  const reduced = useReducedMotion();

  return (
    <View
      testID="thinking-indicator"
      style={[
        s.container,
        { backgroundColor: t.surfaceElevated, borderColor: t.border },
      ]}
    >
      {DOTS.map((delay, i) => (
        <DotItem
          key={i}
          delay={delay}
          color={t.primary600}
          reduced={reduced}
          index={i}
        />
      ))}
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderBottomLeftRadius: 4,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});

export default ThinkingIndicator;
