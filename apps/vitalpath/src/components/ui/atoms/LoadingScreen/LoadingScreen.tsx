import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/src/hooks/useTheme';

export interface LoadingScreenProps {
  size?: 'small' | 'large';
  style?: StyleProp<ViewStyle>;
}

export const LoadingScreen = ({
  size = 'small',
  style,
}: LoadingScreenProps) => {
  const t = useTheme();

  return (
    <SafeAreaView style={[s.container, style]} edges={['top']}>
      <View style={s.center}>
        <ActivityIndicator size={size} color={t.primary600} />
      </View>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

export default LoadingScreen;
