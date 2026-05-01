import { useState } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  Button,
  EmptyState,
  LoadingScreen,
  ScreenHeader,
} from '@/src/components/ui/atoms';
import {
  SectionHeader,
  CustomModal,
  Divider,
  MedicationRow,
} from '@/src/components/ui/molecules';
import CustomUpdateModal from '@/src/components/ui/molecules/CustomUpdateModal/CustomUpdateModal';
import { useMedicaments, useDeleteMedication } from '@repo/api-client';
import { Medication } from '@repo/types';
import { useTheme } from '@/src/hooks/useTheme';
import { useCompletedSet, useDisclosure } from '@/src/hooks';

export default function MedicationsScreen() {
  const t = useTheme();
  const { data: medicaments, isLoading } = useMedicaments();
  const { mutateAsync: deleteMedication } = useDeleteMedication();
  const createModal = useDisclosure();
  const editModal = useDisclosure<string>();
  const { completedIds, markCompleted } = useCompletedSet();
  const [selectedMedicationId, setSelectedMedicationId] = useState<
    string | null
  >(null);

  const handleDelete = async (id: string) => {
    try {
      await deleteMedication(id);
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  if (isLoading) {
    return <LoadingScreen size="small" />;
  }

  return (
    <SafeAreaView
      style={[s.container, { backgroundColor: t.background }]}
      edges={['top']}
    >
      <FlatList
        data={medicaments ?? []}
        keyExtractor={(item: Medication) => item._id}
        contentContainerStyle={s.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <ScreenHeader
              title="Medicamentos"
              subtitle="Tus medicamentos programados para hoy"
            />

            <View style={s.sectionHeaderWrapper}>
              <View style={s.row}>
                <SectionHeader title="De hoy" style={s.flex1} />
                <Button
                  title="Agregar"
                  onPress={() => createModal.open()}
                  size="sm"
                  variant="primary"
                />
              </View>
            </View>
          </>
        }
        ItemSeparatorComponent={() => <Divider style={s.divider} />}
        renderItem={({ item }: { item: Medication }) => (
          <View style={s.rowPadding}>
            <MedicationRow
              name={item.name}
              description={item.description}
              onDeletePress={() => handleDelete(item._id)}
              onTakePress={() => markCompleted(item._id)}
              onEditPress={() => setSelectedMedicationId(item._id)}
              isDone={completedIds.includes(item._id)}
            />
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            icon="activity"
            title="Salud al día"
            subtitle="No tienes medicamentos programados para hoy."
          />
        }
      />

      <CustomModal visible={createModal.isOpen} onClose={createModal.close} />

      {selectedMedicationId && (
        <CustomUpdateModal
          visible={!!selectedMedicationId}
          onClose={() => setSelectedMedicationId(null)}
          id={selectedMedicationId}
        />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  listContent: { paddingBottom: 100 },
  sectionHeaderWrapper: { paddingHorizontal: 20, paddingBottom: 12 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flex1: { flex: 1 },
  divider: { marginHorizontal: 20 },
  rowPadding: { paddingHorizontal: 20 },
});
