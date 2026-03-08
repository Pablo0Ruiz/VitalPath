import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '../global.css';

import { Text, View } from 'react-native';

export default function RootLayout() {
  return (
    <View>
      <Text>RootLayout</Text>
      <StatusBar style="auto" />
    </View>
  );
}
