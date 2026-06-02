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

const ThinkingIndicator = () => {
  const t = useTheme();
  const isReducedMotion = useReducedMotion();

  const opacities = [
    useSharedValue(0.3),
    useSharedValue(0.3),
    useSharedValue(0.3),
  ];

  useEffect(() => {
    if (isReducedMotion) return;

    opacities.forEach((opacity, i) => {
      opacity.value = withRepeat(
        withDelay(
          DOTS[i],
          withSequence(
            withTiming(1, { duration: 400 }),
            withTiming(0.3, { duration: 400 }),
          ),
        ),
        -1,
        false,
      );
    });

    return () => {
      opacities.forEach(o => cancelAnimation(o));
    };
  }, [isReducedMotion]);

  const styles = opacities.map(opacity =>
    useAnimatedStyle(() => ({
      opacity: isReducedMotion ? 0.6 : opacity.value,
    })),
  );

  return (
    <View
      testID="thinking-indicator"
      style={[
        s.container,
        { backgroundColor: t.surfaceElevated, borderColor: t.border },
      ]}
    >
      {DOTS.map((_, i) => (
        <AnimatedView
          key={i}
          testID={`thinking-dot-${i}`}
          style={[s.dot, { backgroundColor: t.primary600 }, styles[i]]}
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
