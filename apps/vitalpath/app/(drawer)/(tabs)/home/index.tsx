import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';

import { Button, HeaderHome, LoadingScreen } from '@/src/components/ui/atoms';
import {
  CustomList,
  CustomModal,
  SectionHeader,
  DailyCheckIn,
} from '@/src/components/ui/molecules';
import CustomUpdateModal from '@/src/components/ui/molecules/CustomUpdateModal/CustomUpdateModal';
import { useAuthStore } from '@repo/store';
import {
  useCitas,
  useDeleteMedication,
  useMedicaments,
} from '@repo/api-client';
import { ROUTES } from '@/src/routes/routes';
import { extractDateKey } from '@/src/utils/date';
import { useTheme } from '@/src/hooks/useTheme';
import { useCompletedSet, useDisclosure } from '@/src/hooks';

export default function DashboardScreen() {
  const t = useTheme();
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const createModal = useDisclosure();
  const editModal = useDisclosure<string>();
  const { completedIds, markCompleted } = useCompletedSet();
  const { data: medicaments, isLoading } = useMedicaments();
  const { data: citas = [], isLoading: isLoadCitas } = useCitas(
    user?._id ?? '',
  );
  const { mutateAsync: deleteMedication } = useDeleteMedication();

  const upcomingCitas = useMemo(() => {
    const today = extractDateKey(new Date());
    return [...citas]
      .filter(c => c.fecha >= today)
      .sort((a, b) => {
        const dateCompare = a.fecha.localeCompare(b.fecha);
        if (dateCompare !== 0) return dateCompare;
        return a.hora.localeCompare(b.hora);
      })
      .slice(0, 3);
  }, [citas]);

  const handleDelete = async (id: string) => {
    try {
      await deleteMedication(id);
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  return (
    <SafeAreaView
      style={[s.container, { backgroundColor: t.background }]}
      edges={['top']}
    >
      <View style={s.topBar}>
        <HeaderHome
          textLabel="Buenos dias"
          nameUser={user?.name}
          style={s.flex1}
        />
        <View style={s.actions}>
          <Button
            variant="ghost"
            size="sm"
            style={[s.iconButton, { backgroundColor: t.neutral100 }]}
            onPress={() => console.log('Notification')}
          >
            <Ionicons
              name="notifications-outline"
              size={22}
              color={t.textSecondary}
            />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            style={[s.iconButton, { backgroundColor: t.neutral100 }]}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          >
            <Ionicons name="menu-outline" size={24} color={t.textSecondary} />
          </Button>
        </View>
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.section}>
          <DailyCheckIn />

          <SectionHeader
            title="Próximas citas"
            linkLabel="Ver todas"
            onLinkPress={() => router.push(ROUTES.APPOINTMENTS)}
            style={s.sectionHeader}
          />
          <View
            style={[
              s.card,
              { backgroundColor: t.surfaceElevated, borderColor: t.border },
            ]}
          >
            {isLoadCitas ? (
              <LoadingScreen size="small" />
            ) : (
              <CustomList type="cita" data={upcomingCitas} />
            )}
          </View>
        </View>

        <View style={s.section}>
          <View style={s.medicationHeader}>
            <SectionHeader
              title="Medicamentos de hoy"
              linkLabel="Ver todos"
              onLinkPress={() => router.push(ROUTES.MEDICATIONS)}
              style={s.flex1}
            />
            <Button
              title="Agregar"
              onPress={() => createModal.open()}
              size="sm"
              variant="primary"
            />
            <CustomModal
              visible={createModal.isOpen}
              onClose={createModal.close}
            />
          </View>

          {isLoading ? (
            <LoadingScreen size="small" />
          ) : (
            <View
              style={[
                s.card,
                { backgroundColor: t.surfaceElevated, borderColor: t.border },
              ]}
            >
              <CustomList
                type="medication"
                data={medicaments}
                onDelete={handleDelete}
                onEdit={id => editModal.open(id)}
                onTake={markCompleted}
                completedIds={completedIds}
              />
            </View>
          )}
        </View>
      </ScrollView>

      {editModal.isOpen && editModal.data && (
        <CustomUpdateModal
          visible={editModal.isOpen}
          onClose={editModal.close}
          id={editModal.data}
        />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  section: { paddingHorizontal: 20, paddingTop: 20 },
  sectionHeader: { marginTop: 12, marginBottom: 8 },
  card: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  medicationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  flex1: { flex: 1 },
});
