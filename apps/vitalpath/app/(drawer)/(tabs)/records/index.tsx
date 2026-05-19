import { useMemo } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useMedicalResultsPaciente, useCitas } from '@repo/api-client';
import { useAuthStore } from '@/src/stores/auth';
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
  const { user } = useAuthStore();
  const {
    data: resultados,
    isLoading: isLoadResults,
    refetch,
    isFetching: isFetchingResults,
  } = useMedicalResultsPaciente();
  const {
    data: citas = [],
    isLoading: isLoadCitas,
    refetch: refetchCitas,
    isFetching: isFetchingCitas,
  } = useCitas(user?._id ?? '');

  const data = useMemo(() => {
    const list: IMedicalResults[] = [...(resultados || [])];

    const ongoingStates = ['asistida', 'en_proceso'];
    const ongoingCitas = citas.filter(
      c =>
        ongoingStates.includes(c.estado) &&
        !list.some(r => r.cita_ID?._id === c._id),
    );

    const virtualResults = ongoingCitas.map(c => ({
      _id: c._id,
      cita_ID: {
        _id: c._id,
        fecha: c.fecha,
        hora: c.hora,
        estado: c.estado,
      },
      medico_ID: c.medico_ID,
      paciente_ID: c.paciente_ID,
      fileUrl: '',
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    })) as IMedicalResults[];

    return [...virtualResults, ...list].sort((a, b) => {
      const dateA = a.cita_ID?.fecha || a.createdAt;
      const dateB = b.cita_ID?.fecha || b.createdAt;
      return dateB.localeCompare(dateA);
    });
  }, [resultados, citas]);

  const isInitialLoading =
    (isLoadResults && !resultados) || (isLoadCitas && citas.length === 0);

  const isRefreshing = isFetchingResults || isFetchingCitas;

  return (
    <SafeAreaView
      style={[s.container, { backgroundColor: t.background }]}
      edges={['top']}
    >
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
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  listContent: { padding: 20, gap: 12, paddingBottom: 100 },
});
