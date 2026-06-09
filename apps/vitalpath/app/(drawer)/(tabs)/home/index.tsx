import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import {
  EmptyState,
  LoadingScreen,
  MetricCard,
} from '@/src/components/ui/atoms';
import {
  AppointmentPreviewRow,
  MedicationRow,
  DailyCheckIn,
  EmptyPacienteActivoState,
  HomeTopBar,
  SectionHeader,
} from '@/src/components/ui/molecules';
import { useChatContextStore } from '@repo/store';
import { useAuthStore } from '@/src/stores/auth';
import {
  useMedicaments,
  useDeleteMedication,
  useTakeMedication,
} from '@repo/api-client';
import { Medication } from '@repo/types';
import { ROUTES } from '@/src/routes/routes';
import { useTheme } from '@/src/hooks/useTheme';
import { useDisclosure, useActivePatientId } from '@/src/hooks';
import { useSeniorUIStore } from '@/src/stores/seniorUI.store';
import {
  ScreenLayout,
  VoiceAssistantModal,
} from '@/src/components/ui/organisms';
import { Ionicons } from '@expo/vector-icons';
import { useAdherence } from '@/src/hooks/useAdherence';
import { useUpcomingCitas } from '@/src/hooks/useUpcomingCitas';
import { MedicationFormModal } from '@/src/components/ui/molecules/MedicationFormModal';
import { cancelNotifications } from '@/src/utils/medicationNotifications';

export default function DashboardScreen() {
  const t = useTheme();
  const { user } = useAuthStore();
  const { isSeniorUI } = useSeniorUIStore();
  const chatId = useChatContextStore(state => state.chatId);
  const voiceModal = useDisclosure();

  const createModal = useDisclosure();
  const editModal = useDisclosure<string>();

  const { patientId, needsSelection } = useActivePatientId();

  const { data: medicaments, isLoading } = useMedicaments();
  const { mutateAsync: deleteMedication } = useDeleteMedication();
  const { mutateAsync: takeMedication } = useTakeMedication();
  const { adherenceValue, pendingMedsCount } = useAdherence();

  const handleDelete = async (id: string, notificationIds: string[] = []) => {
    try {
      if (notificationIds.length > 0)
        await cancelNotifications(notificationIds);
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
  const {
    upcomingCitas,
    nextCitaValue,
    isLoading: isLoadCitas,
  } = useUpcomingCitas(patientId ?? '');

  return (
    <View style={s.root}>
      <ScreenLayout
        showHero={true}
        heroSize="banner"
        heroContent={
          <HomeTopBar
            userName={user?.name}
            pendingMeds={pendingMedsCount}
            nextCita={nextCitaValue}
          />
        }
        scrollable={true}
      >
        {needsSelection ? (
          <EmptyPacienteActivoState />
        ) : (
          <>
            <View style={s.sectionBlock}>
              <View
                style={[
                  s.miniCard,
                  { backgroundColor: t.surface, borderColor: t.border },
                ]}
              >
                <View style={s.checkInInner}>
                  <DailyCheckIn />
                </View>
              </View>
            </View>

            <View style={s.sectionBlock}>
              <SectionHeader
                title="Medicamentos"
                linkLabel="Ver todos"
                onLinkPress={() => router.push(ROUTES.MEDICATIONS)}
              />
              <View
                style={[
                  s.miniCard,
                  { backgroundColor: t.surface, borderColor: t.border },
                ]}
              >
                {isLoading ? (
                  <LoadingScreen size="small" />
                ) : medicaments && medicaments.length > 0 ? (
                  medicaments.slice(0, 3).map(med => (
                    <View key={med._id} style={s.medRowWrapper}>
                      <MedicationRow
                        name={med.name}
                        description={med.description}
                        time={med.startTime}
                        isDone={(med.dosesTaken ?? 0) > 0}
                        onTakePress={() => handleTake(med)}
                        onEditPress={() => editModal.open(med._id)}
                        onDeletePress={() =>
                          handleDelete(med._id, med.notificationIds ?? [])
                        }
                      />
                    </View>
                  ))
                ) : (
                  <EmptyState
                    icon="activity"
                    title="Todavía no registraste medicamentos."
                    subtitle="Agregá tu tratamiento y empezá a recibir recordatorios."
                    actionLabel="+ Agregar medicamento"
                    onAction={() => createModal.open()}
                    style={s.emptyStateCard}
                  />
                )}
              </View>
              {createModal.isOpen && (
                <MedicationFormModal
                  mode="create"
                  visible={createModal.isOpen}
                  onClose={createModal.close}
                />
              )}
            </View>

            <View style={s.sectionBlock}>
              <SectionHeader title="Próximas Citas" />
              <View
                style={[
                  s.miniCard,
                  { backgroundColor: t.surface, borderColor: t.border },
                ]}
              >
                {isLoadCitas ? (
                  <LoadingScreen size="small" />
                ) : upcomingCitas.length > 0 ? (
                  upcomingCitas
                    .slice(0, 2)
                    .map(cita => (
                      <AppointmentPreviewRow key={cita._id} cita={cita} />
                    ))
                ) : (
                  <EmptyState
                    icon="calendar"
                    title="No tenés consultas agendadas."
                    subtitle="Agendá una cita para mantener tu seguimiento organizado."
                    actionLabel="Agendar consulta"
                    onAction={() => router.push(ROUTES.APPOINTMENTS)}
                    style={s.emptyStateCard}
                  />
                )}
              </View>
            </View>

            <View style={s.sectionBlock}>
              <SectionHeader title="Tu progreso" />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={s.metricsRow}
                contentContainerStyle={s.metricsRowContent}
              >
                <MetricCard
                  icon={
                    <Ionicons
                      name="medical-outline"
                      size={18}
                      color={t.secondary500}
                    />
                  }
                  label="ADHERENCIA"
                  value={adherenceValue}
                  color={t.secondary500}
                  index={0}
                />
                <MetricCard
                  icon={
                    <Ionicons
                      name="calendar-outline"
                      size={18}
                      color={t.primary600}
                    />
                  }
                  label="PRÓXIMA CITA"
                  value={nextCitaValue}
                  color={t.primary600}
                  index={1}
                />
                <MetricCard
                  icon={
                    <Ionicons
                      name="happy-outline"
                      size={18}
                      color={t.accentAi}
                    />
                  }
                  label="CHECK-IN"
                  value={null}
                  color={t.accentAi}
                  index={2}
                />
                <MetricCard
                  icon={
                    <Ionicons
                      name="footsteps-outline"
                      size={18}
                      color={t.secondary500}
                    />
                  }
                  label="PASOS"
                  value={null}
                  color={t.secondary500}
                  index={3}
                  onConfigure={() => {}}
                />
              </ScrollView>
            </View>
          </>
        )}
      </ScreenLayout>

      {isSeniorUI && (
        <Pressable
          testID="senior-fab"
          style={[s.fab, { backgroundColor: t.primary600 }]}
          onPress={() => voiceModal.open()}
        >
          <Ionicons name="mic" size={30} color="white" />
        </Pressable>
      )}

      {voiceModal.isOpen && (
        <VoiceAssistantModal
          visible={voiceModal.isOpen}
          onClose={voiceModal.close}
          chatId={chatId}
        />
      )}

      {editModal.isOpen && editModal.data && (
        <MedicationFormModal
          mode="edit"
          medicationId={editModal.data}
          visible={editModal.isOpen}
          onClose={editModal.close}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  sectionBlock: {
    marginTop: 16,
  },
  medRowWrapper: {
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'transparent',
  },
  miniCard: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  checkInInner: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  emptyStateCard: {
    paddingVertical: 24,
  },
  metricsRow: {
    marginHorizontal: -8,
  },
  metricsRowContent: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 65,
    height: 65,
    borderRadius: 32.5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 100,
  },
});
