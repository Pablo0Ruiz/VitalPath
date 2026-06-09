import { useState } from 'react';
import { FlatList, Platform, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  Button,
  EmptyState,
  LoadingScreen,
  ScreenHeader,
} from '@/src/components/ui/atoms';
import {
  SectionHeader,
  Divider,
  MedicationRow,
} from '@/src/components/ui/molecules';
import { MedicationFormModal } from '@/src/components/ui/molecules/MedicationFormModal';
import {
  useMedicaments,
  useDeleteMedication,
  useTakeMedication,
} from '@repo/api-client';
import { Medication } from '@repo/types';
import { useTheme } from '@/src/hooks/useTheme';
import { useDisclosure } from '@/src/hooks';
import { cancelNotifications } from '@/src/utils/medicationNotifications';

export default function MedicationsScreen() {
  const t = useTheme();
  const { data: medicaments, isLoading } = useMedicaments();
  const { mutateAsync: deleteMedication } = useDeleteMedication();
  const { mutateAsync: takeMedication } = useTakeMedication();
  const createModal = useDisclosure();
  const [selectedMedicationId, setSelectedMedicationId] = useState<
    string | null
  >(null);

  const handleDelete = async (id: string, notificationIds: string[] = []) => {
    try {
      if (notificationIds.length > 0) {
        await cancelNotifications(notificationIds);
      }
      await deleteMedication(id);
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  const handleTake = async (item: Medication) => {
    try {
      const result = await takeMedication(item._id);
      if (result.completed && item.notificationIds?.length) {
        await cancelNotifications(item.notificationIds);
      }
    } catch (error) {
      console.error('Error al registrar dosis:', error);
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
        removeClippedSubviews={Platform.OS === 'android'}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={7}
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
              onDeletePress={() =>
                handleDelete(item._id, item.notificationIds ?? [])
              }
              onTakePress={() => handleTake(item)}
              onEditPress={() => setSelectedMedicationId(item._id)}
              isDone={(item.dosesTaken ?? 0) > 0}
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

      <MedicationFormModal
        mode="create"
        visible={createModal.isOpen}
        onClose={createModal.close}
      />

      {selectedMedicationId && (
        <MedicationFormModal
          mode="edit"
          medicationId={selectedMedicationId}
          visible={!!selectedMedicationId}
          onClose={() => setSelectedMedicationId(null)}
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
