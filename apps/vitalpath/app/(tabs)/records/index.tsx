import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TextField } from '@/src/components/ui/atoms';
import { TrackingTimeline } from '@/src/components/ui/organism/TrackingTimeline';

export default function RecordsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pt-6 pb-10"
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-6">
          <TextField variant="title" className="mb-1">
            Panel de Seguimiento
          </TextField>
          <TextField variant="subtitle">
            Sigue el estado de tus análisis clínicos en tiempo real.
          </TextField>
        </View>
        <TrackingTimeline onPrivacyPress={() => console.log('privacy')} />
      </ScrollView>
    </SafeAreaView>
  );
}
