import { useState, useMemo } from 'react';
import { FlatList, View, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  EmptyState,
  LoadingScreen,
  ScreenHeader,
} from '@/src/components/ui/atoms';
import {
  SectionHeader,
  AppointmentCard,
  DoctorPickerSheet,
  EmptyPacienteActivoState,
} from '@/src/components/ui/molecules';
import { CalendarWidget } from '@/src/components/ui/organisms';
import { useCitas, useCancelCita } from '@repo/api-client';

import { extractDateKey } from '@/src/utils/date';
import { CitaPopulated } from '@repo/types';
import { useTheme } from '@/src/hooks/useTheme';
import { useDisclosure, useActivePatientId } from '@/src/hooks';

export default function AppointmentsScreen() {
  const t = useTheme();
  const { patientId, needsSelection } = useActivePatientId();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const sheet = useDisclosure<Date>();

  const {
    data: citas = [],
    isLoading,
    isRefetching,
  } = useCitas(patientId ?? '');

  const { mutate: cancelarCita, isPending: isCancelling } = useCancelCita();

  const appointmentsMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    citas.forEach((cita: CitaPopulated) => {
      map[cita.fecha] = true;
    });
    return map;
  }, [citas]);

  const todaysAppointments = useMemo(() => {
    const targetKey = extractDateKey(selectedDate);
    return citas.filter((cita: CitaPopulated) => cita.fecha === targetKey);
  }, [citas, selectedDate]);

  const handleCancelar = (citaId: string) => {
    Alert.alert(
      'Cancelar cita',
      '¿Estás seguro de que querés cancelar esta cita?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: () => cancelarCita(citaId),
        },
      ],
    );
  };

  if (isLoading && !isRefetching) {
    return <LoadingScreen size="small" />;
  }

  if (needsSelection) {
    return (
      <SafeAreaView
        style={[s.container, { backgroundColor: t.background }]}
        edges={['top']}
      >
        <ScreenHeader title="Citas" subtitle="Gestioná tus citas médicas" />
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
        data={todaysAppointments}
        keyExtractor={item => item._id}
        contentContainerStyle={s.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <ScreenHeader title="Citas" subtitle="Gestioná tus citas médicas" />

            <View style={s.calendarWrapper}>
              <CalendarWidget
                appointmentsMap={appointmentsMap}
                onDateChange={date => setSelectedDate(date)}
                initialDate={selectedDate}
                onDayPressSheet={date => sheet.open(date)}
              />
            </View>

            <View style={s.sectionHeaderWrapper}>
              <SectionHeader title="Citas seleccionadas" style={s.noMargin} />
            </View>
          </>
        }
        ItemSeparatorComponent={() => <View style={s.separator} />}
        renderItem={({ item }) => (
          <View style={s.rowPadding}>
            <AppointmentCard
              appointment={item}
              onCancel={handleCancelar}
              isCancelling={isCancelling}
            />
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            icon="calendar"
            title="Agenda libre"
            subtitle="No hay citas para este día"
          />
        }
      />
      <DoctorPickerSheet
        visible={sheet.isOpen}
        date={sheet.data}
        onClose={sheet.close}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  emptyStateWrapper: { flex: 1, justifyContent: 'center' },
  listContent: { paddingBottom: 120 },
  calendarWrapper: { paddingHorizontal: 20, paddingTop: 20, marginBottom: 20 },
  sectionHeaderWrapper: { paddingHorizontal: 20, marginBottom: 12 },
  noMargin: { marginBottom: 0 },
  separator: { height: 12 },
  rowPadding: { paddingHorizontal: 20 },
});
