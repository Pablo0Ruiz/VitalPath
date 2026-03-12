import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '../global.css';

import { View } from 'react-native';
import { useColorScheme } from 'nativewind';
import { themes } from '@/constants/theme';

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <View
      style={[{ flex: 1 }, themes[colorScheme ?? 'light']]}
      className="bg-bg-base"
    >
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </View>
  );
}
