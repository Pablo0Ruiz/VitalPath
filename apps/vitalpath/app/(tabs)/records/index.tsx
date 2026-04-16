import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TextField } from '@/src/components/ui/atoms';
import { TrackingTimeline } from '@/src/components/ui/organism/TrackingTimeline';

export default function RecordsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5 pt-6 pb-4 border-b border-brand-slate-100">
          <TextField
            variant="title"
            className="text-brand-slate-900 font-bold text-[28px] leading-tight text-left mb-1"
          >
            Análisis
          </TextField>
          <TextField
            variant="caption"
            className="text-brand-slate-400 text-sm text-left"
          >
            Seguimiento en tiempo real de tus resultados clínicos
          </TextField>
        </View>

        <View className="px-5 pt-5">
          <TrackingTimeline onPrivacyPress={() => {}} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
