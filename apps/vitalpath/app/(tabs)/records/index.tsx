import { FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useMedicalResultsPaciente } from '@repo/api-client';
import type { IMedicalResults } from '@repo/types';

import {
  EmptyState,
  LoadingScreen,
  ScreenHeader,
} from '@/src/components/ui/atoms';
import { StudyCard } from '@/src/components/ui/molecules/StudyCard';
import { useTheme } from '@/src/hooks/useTheme';

export default function RecordsScreen() {
  const t = useTheme();
  const { data: resultados, isLoading } = useMedicalResultsPaciente();

  return (
    <SafeAreaView
      style={[s.container, { backgroundColor: t.background }]}
      edges={['top']}
    >
      <ScreenHeader
        title="Análisis"
        subtitle="Seguimiento en tiempo real de tus resultados clínicos"
      />

      {isLoading ? (
        <LoadingScreen size="large" />
      ) : !resultados?.length ? (
        <EmptyState
          icon="file-text"
          title="Sin estudios"
          subtitle="Aún no tienes estudios clínicos o análisis registrados en tu historial."
        />
      ) : (
        <FlatList
          data={resultados}
          keyExtractor={(item: IMedicalResults) => item._id}
          contentContainerStyle={s.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }: { item: IMedicalResults }) => (
            <StudyCard
              study={item}
              onPress={() => router.push(`/records/${item._id}`)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  listContent: { padding: 20, gap: 12, paddingBottom: 100 },
});
