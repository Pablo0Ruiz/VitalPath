import { useState, useMemo } from 'react';
import { FlatList, View, Alert, StyleSheet } from 'react-native';

import { Button } from '@/src/components/ui/atoms/Button';
import { EmptyState } from '@/src/components/ui/atoms/EmptyState';
import { LoadingScreen } from '@/src/components/ui/atoms/LoadingScreen';
import { ScreenHeader } from '@/src/components/ui/atoms/ScreenHeader';
import { SectionHeader } from '@/src/components/ui/molecules/SectionHeader';
import { AppointmentCard } from '@/src/components/ui/molecules/AppointmentCard';
import { DoctorPickerSheet } from '@/src/components/ui/molecules/DoctorPickerSheet';
import { EditCitaSheet } from '@/src/components/ui/molecules/EditCitaSheet';
import { EmptyPacienteActivoState } from '@/src/components/ui/molecules/EmptyPacienteActivoState';
import { CalendarWidget } from '@/src/components/ui/organisms/CalendarWidget';
import { ScreenLayout } from '@/src/components/ui/organisms';
import { CuidadorAppointmentsView } from '@/src/components/ui/molecules/CuidadorAppointmentsView/CuidadorAppointmentsView';
import { useCitas, useCancelCita } from '@repo/api-client';

import {
  extractDateKey,
  parseLocalDateTime,
  formatDateHuman,
} from '@/src/utils/date';
import { CitaPopulated } from '@repo/types';
import { useTheme } from '@/src/hooks/useTheme';
import { useDisclosure, useActivePatientId } from '@/src/hooks';
import { useRole } from '@/src/hooks/useRole';

interface RescheduleData {
  citaId: string;
  fecha: string;
  hora: string;
}

function PacienteAppointmentsView() {
  const t = useTheme();
  const { patientId, needsSelection } = useActivePatientId();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [hasPickedDate, setHasPickedDate] = useState(false);
  const sheet = useDisclosure<Date>();
  const reschedule = useDisclosure<RescheduleData>();

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

  const sectionTitle = useMemo(() => {
    if (!hasPickedDate) return 'Citas de hoy';
    const key = extractDateKey(selectedDate);
    const todayKey = extractDateKey(new Date());
    if (key === todayKey) return 'Citas de hoy';
    return `Citas del ${formatDateHuman(key)}`;
  }, [selectedDate, hasPickedDate]);

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

  const handleReschedule = (cita: CitaPopulated) => {
    reschedule.open({ citaId: cita._id, fecha: cita.fecha, hora: cita.hora });
  };

  const isOverdue = (cita: CitaPopulated): boolean => {
    return (
      cita.estado === 'agendada' &&
      parseLocalDateTime(cita.fecha, cita.hora) < new Date()
    );
  };

  if (isLoading && !isRefetching) {
    return <LoadingScreen size="small" />;
  }

  if (needsSelection) {
    return (
      <ScreenLayout scrollable={false}>
        <ScreenHeader title="Citas" subtitle="Gestioná tus citas médicas" />
        <View style={s.emptyStateWrapper}>
          <EmptyPacienteActivoState />
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout scrollable={false}>
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
                onDateChange={date => {
                  setSelectedDate(date);
                  setHasPickedDate(true);
                }}
                initialDate={selectedDate}
              />
            </View>

            <View style={s.addButtonWrapper}>
              <Button
                testID="calendar-add-button"
                title="+ Agregar cita"
                variant="primary"
                onPress={() => sheet.open(selectedDate)}
              />
            </View>

            <View style={s.sectionHeaderWrapper}>
              <SectionHeader title={sectionTitle} style={s.noMargin} />
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
              isOverdue={isOverdue(item)}
              onReschedule={() => handleReschedule(item)}
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

      {reschedule.isOpen && reschedule.data && (
        <EditCitaSheet
          isOpen={reschedule.isOpen}
          citaId={reschedule.data.citaId}
          prefillFecha={reschedule.data.fecha}
          prefillHora={reschedule.data.hora}
          onClose={reschedule.close}
          onSuccess={reschedule.close}
        />
      )}
    </ScreenLayout>
  );
}

export default function AppointmentsScreen() {
  const role = useRole();

  if (role === 'cuidador_familiar') return <CuidadorAppointmentsView />;
  return <PacienteAppointmentsView />;
}

const s = StyleSheet.create({
  emptyStateWrapper: { flex: 1, justifyContent: 'center' },
  listContent: { paddingBottom: 120 },
  calendarWrapper: { paddingHorizontal: 20, paddingTop: 20, marginBottom: 12 },
  addButtonWrapper: { paddingHorizontal: 20, marginBottom: 20 },
  sectionHeaderWrapper: { paddingHorizontal: 20, marginBottom: 12 },
  noMargin: { marginBottom: 0 },
  separator: { height: 12 },
  rowPadding: { paddingHorizontal: 20 },
});
