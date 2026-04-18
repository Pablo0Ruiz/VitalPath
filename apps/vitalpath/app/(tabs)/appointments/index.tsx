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
import { useCitas, useCreateCita, useCancelCita } from '@repo/api-client';
import { extractDateKey } from '@/src/utils/date';
import { Cita } from '@repo/types';

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
    agendarCita({
      fechaHora: newAppointmentDate.toISOString(),
      medico_ID: '69c08cce875c20a70bd4f3db',
      centroSalud_ID: '69c08cfe875c20a70bd4f3dd',
    });
  };

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

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ───────────────────────────────────────────── */}
        <View className="px-5 pt-6 pb-4 border-b border-brand-slate-100">
          <TextField
            variant="title"
            className="text-brand-slate-900 font-bold text-[28px] leading-tight text-left mb-1"
          >
            Citas
          </TextField>
          <TextField
            variant="caption"
            className="text-brand-slate-400 text-sm text-left"
          >
            Gestioná tus citas médicas
          </TextField>
        </View>

        {/* ── Calendar ─────────────────────────────────────────── */}
        <View className="px-5 pt-5 mb-5">
          <CalendarWidget
            appointmentsMap={appointmentsMap}
            onDateChange={date => setSelectedDate(date)}
            initialDate={selectedDate}
          />
        </View>

        {/* ── Citas del día ────────────────────────────────────── */}
        <View className="px-5">
          <View className="flex-row items-center justify-between mb-3">
            <SectionHeader
              title="Citas seleccionadas"
              className="flex-1 mb-0"
            />
            <Button
              title={isCreating ? '...' : 'Agendar'}
              variant="primary"
              size="sm"
              onPress={handleAgendar}
              disabled={isCreating}
              loading={isCreating}
            />
          </View>

          <View className="bg-white rounded-2xl border border-brand-slate-100 overflow-hidden">
            {isLoading && !isRefetching ? (
              <View className="py-8 items-center">
                <ActivityIndicator size="small" color="#7c3aed" />
              </View>
            ) : todaysAppointments.length > 0 ? (
              <View className="px-4">
                {todaysAppointments.map((appt: Cita, idx: number) => (
                  <View key={appt._id}>
                    <AppointmentCard
                      appointment={appt}
                      onCancel={handleCancelar}
                      isCancelling={isCancelling}
                    />
                    {idx < todaysAppointments.length - 1 && (
                      <Divider className="bg-brand-slate-100" />
                    )}
                  </View>
                ))}
              </View>
            ) : (
              <View className="py-10 items-center">
                <TextField
                  variant="caption"
                  className="text-brand-slate-400 text-sm text-center"
                >
                  No hay citas para este día
                </TextField>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
