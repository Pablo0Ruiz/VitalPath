import { useMemo } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useMedicalResultsPaciente, useCitas } from '@repo/api-client';
import { useAuthStore } from '@repo/store';
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
  const { data: resultados, isLoading: isLoadResults } =
    useMedicalResultsPaciente();
  const { data: citas = [], isLoading: isLoadCitas } = useCitas(
    user?._id ?? '',
  );

  const data = useMemo(() => {
    const list: IMedicalResults[] = [...(resultados || [])];

    const ongoingStates = ['asistida', 'en_proceso'];
    const ongoingCitas = citas.filter(
      c =>
        ongoingStates.includes(c.estado) &&
        !list.some(r => r.cita_ID._id === c._id),
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

    return [...virtualResults, ...list].sort((a, b) =>
      b.cita_ID.fecha.localeCompare(a.cita_ID.fecha),
    );
  }, [resultados, citas]);

  const isLoading = isLoadResults || isLoadCitas;

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
      ) : !data.length ? (
        <EmptyState
          icon="file-text"
          title="Sin estudios"
          subtitle="Aún no tienes estudios clínicos o análisis registrados en tu historial."
        />
      ) : (
        <FlatList
          data={data}
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
