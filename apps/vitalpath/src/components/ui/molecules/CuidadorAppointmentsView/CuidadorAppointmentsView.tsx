import { FlatList, View, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/src/components/ui/atoms/EmptyState';
import { LoadingScreen } from '@/src/components/ui/atoms/LoadingScreen';
import { ScreenHeader } from '@/src/components/ui/atoms/ScreenHeader';
import { SectionHeader } from '@/src/components/ui/molecules/SectionHeader';
import { AppointmentCard } from '@/src/components/ui/molecules/AppointmentCard';
import { EmptyPacienteActivoState } from '@/src/components/ui/molecules/EmptyPacienteActivoState';
import { useCitasForCuidador } from '@repo/api-client';
import { useTheme } from '@/src/hooks/useTheme';
import { useActivePatientId } from '@/src/hooks';

export function CuidadorAppointmentsView() {
  const t = useTheme();
  const { patientId, needsSelection } = useActivePatientId();
  const {
    data: citas = [],
    isLoading,
    isRefetching,
  } = useCitasForCuidador(patientId);

  if (isLoading && !isRefetching) {
    return (
      <View testID="loading-screen" style={{ flex: 1 }}>
        <LoadingScreen size="small" />
      </View>
    );
  }

  if (needsSelection) {
    return (
      <SafeAreaView
        style={[s.container, { backgroundColor: t.background }]}
        edges={['top']}
      >
        <ScreenHeader title="Citas" subtitle="Citas del paciente activo" />
        <View style={s.emptyStateWrapper}>
          <EmptyPacienteActivoState />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[s.container, { backgroundColor: t.background }]}
      edges={['top']}
    >
      <FlatList
        data={citas}
        keyExtractor={item => item._id}
        contentContainerStyle={s.listContent}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={Platform.OS === 'android'}
        ListHeaderComponent={
          <>
            <ScreenHeader title="Citas" subtitle="Citas del paciente activo" />
            <View style={s.sectionHeaderWrapper}>
              <SectionHeader title="Próximas citas" style={s.noMargin} />
            </View>
          </>
        }
        ItemSeparatorComponent={() => <View style={s.separator} />}
        renderItem={({ item }) => (
          <View style={s.rowPadding} testID="appointment-card">
            <AppointmentCard appointment={item} />
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            icon="calendar"
            title="Sin citas"
            subtitle="No hay citas registradas para este paciente"
          />
        }
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  emptyStateWrapper: { flex: 1, justifyContent: 'center' },
  listContent: { paddingBottom: 120 },
  sectionHeaderWrapper: { paddingHorizontal: 20, marginBottom: 12 },
  noMargin: { marginBottom: 0 },
  separator: { height: 12 },
  rowPadding: { paddingHorizontal: 20 },
});
