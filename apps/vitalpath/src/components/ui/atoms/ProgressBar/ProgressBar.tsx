import { DimensionValue, StyleSheet, View, ViewProps } from 'react-native';
import { useTheme } from '@/src/hooks/useTheme';

export interface ProgressBarProps extends ViewProps {
  progress: number;
}

const ProgressBar = ({ progress, style, ...props }: ProgressBarProps) => {
  const t = useTheme();

  return (
    <View style={[s.track, { backgroundColor: t.border }, style]} {...props}>
      <View
        style={[
          s.fill,
          {
            width: `${progress}%` as DimensionValue,
            backgroundColor: t.primary600,
          },
        ]}
      />
    </View>
  );
};

const s = StyleSheet.create({
  track: { height: 8, borderRadius: 9999, width: '100%', overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 9999 },
});

export default ProgressBar;
