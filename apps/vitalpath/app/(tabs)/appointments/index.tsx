import { useState, useMemo } from 'react';
import { ScrollView, View, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TextField, Button } from '@/src/components/ui/atoms';
import {
  SectionHeader,
  AppointmentCard,
  Divider,
} from '@/src/components/ui/molecules';
import { CalendarWidget } from '@/src/components/ui/organism';
import {
  useCitas,
  useCreateCita,
  useCancelCita,
} from '@/src/hooks/dashboard/useCitas';
import { extractDateKey } from '@/src/utils/date';
import { Cita } from '@/src/interfaces/appointments/appointments.interface';

export default function AppointmentsScreen() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const { data: citas = [], isLoading, isRefetching } = useCitas();
  const { mutate: agendarCita, isPending: isCreating } = useCreateCita();
  const { mutate: cancelarCita, isPending: isCancelling } = useCancelCita();

  const appointmentsMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    citas.forEach((cita: Cita) => {
      const date = new Date(cita.fechaHora);
      map[extractDateKey(date)] = true;
    });
    return map;
  }, [citas]);

  const todaysAppointments = useMemo(() => {
    const targetKey = extractDateKey(selectedDate);
    return citas.filter((cita: Cita) => {
      const citaKey = extractDateKey(new Date(cita.fechaHora));
      return citaKey === targetKey;
    });
  }, [citas, selectedDate]);

  const handleAgendar = () => {
    const newAppointmentDate = new Date(selectedDate);
    newAppointmentDate.setHours(10, 0, 0, 0);
    //TODO:Falta definir el popUp para seleccionar el medico y el centro de salud
    agendarCita({
      fechaHora: newAppointmentDate.toISOString(),
      medico_ID: '69c08cce875c20a70bd4f3db',
      centroSalud_ID: '69c08cfe875c20a70bd4f3dd',
    });
  };
  const handleCancelar = (citaId: string) => {
    Alert.alert(
      'Cancelar cita',
      '¿Estás seguro de que quieres cancelar esta cita?',
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

  return (
    <SafeAreaView className="flex-1 bg-brand-surface-low">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pt-6 pb-10"
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-6">
          <TextField
            variant="title"
            className="mb-1 text-slate-900 font-extrabold text-[30px] leading-tight tracking-tight"
          >
            Citas
          </TextField>
          <TextField
            variant="subtitle"
            className="text-slate-500 text-base font-normal"
          >
            Gestiona tus citas médicas.
          </TextField>
        </View>

        <View className="mb-8">
          <CalendarWidget
            appointmentsMap={appointmentsMap}
            onDateChange={date => setSelectedDate(date)}
            initialDate={selectedDate}
          />
        </View>

        <View className="flex-row justify-between flex-wrap items-center mb-4">
          <SectionHeader title="Citas Seleccionadas" className="flex-1" />
          <Button
            title={isCreating ? '...' : '+ Agendar Cita'}
            variant="primary"
            onPress={handleAgendar}
            disabled={isCreating}
            className="py-2 px-3 rounded-lg"
          />
        </View>

        <View className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          {isLoading && !isRefetching ? (
            <ActivityIndicator size="small" color="#7c3aed" className="my-4" />
          ) : todaysAppointments.length > 0 ? (
            todaysAppointments.map((appt: Cita, idx: number) => (
              <View key={appt._id}>
                <AppointmentCard
                  appointment={appt}
                  onCancel={handleCancelar}
                  isCancelling={isCancelling}
                />
                {idx < todaysAppointments.length - 1 && (
                  <Divider className="my-2 bg-slate-100" />
                )}
              </View>
            ))
          ) : (
            <TextField
              variant="body"
              className="text-center text-slate-400 py-4"
            >
              No hay citas agendadas para este día.
            </TextField>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
