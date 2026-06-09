import { FlatList, Platform, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import type { IMedicalResults } from '@repo/types';

import {
  EmptyState,
  LoadingScreen,
  ScreenHeader,
} from '@/src/components/ui/atoms';
import { StudyCard } from '@/src/components/ui/molecules/StudyCard';
import { ScreenLayout } from '@/src/components/ui/organisms';
import { useVirtualStudies } from '@/src/hooks/useVirtualStudies';

export default function RecordsScreen() {
  const { data, isInitialLoading, isRefreshing, refetch, refetchCitas } =
    useVirtualStudies();

  return (
    <ScreenLayout scrollable={false}>
      <ScreenHeader
        title="Análisis"
        subtitle="Seguimiento en tiempo real de tus resultados clínicos"
      />

      {isInitialLoading ? (
        <LoadingScreen size="large" />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item: IMedicalResults) => item._id}
          contentContainerStyle={[
            s.listContent,
            data.length === 0 && { flexGrow: 1 },
          ]}
          refreshing={isRefreshing}
          onRefresh={() => {
            refetch();
            refetchCitas();
          }}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={Platform.OS === 'android'}
          initialNumToRender={8}
          ListEmptyComponent={
            <EmptyState
              icon="file-text"
              title="Sin estudios"
              subtitle="Aún no tienes estudios clínicos o análisis registrados en tu historial."
            />
          }
          renderItem={({ item }: { item: IMedicalResults }) => (
            <StudyCard
              study={item}
              onPress={() => router.push(`/records/${item._id}`)}
            />
          )}
        />
      )}
    </ScreenLayout>
  );
}

const s = StyleSheet.create({
  listContent: { padding: 20, gap: 12, paddingBottom: 100 },
});
