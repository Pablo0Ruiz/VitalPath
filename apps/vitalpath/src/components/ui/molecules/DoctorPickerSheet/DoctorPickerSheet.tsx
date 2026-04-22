import { useState } from 'react';
import { Modal, View, Pressable, ScrollView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TextField } from '../../atoms';
import { useCreateCita, useDoctors } from '@repo/api-client';
import { CreateCitaPayload } from '@repo/types';
import { extractDateKey } from '@/src/utils/date';

import { MONTH_NAMES } from '@/src/constants/monthAndDay';
import { DoctorCard } from '../DoctorCard/DoctorCard';

const FULL_DAY_NAMES = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];

function formatDate(date: Date): string {
  return `${FULL_DAY_NAMES[date.getDay()]}, ${date.getDate()} de ${MONTH_NAMES[date.getMonth()]}`;
}

interface DoctorPickerSheetProps {
  visible: boolean;
  date: Date | null;
  onClose: () => void;
}

export const DoctorPickerSheet = ({
  visible,
  date,
  onClose,
}: DoctorPickerSheetProps) => {
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const { data: doctor } = useDoctors();
  const { mutate: agendarCita, isPending: isCreating } = useCreateCita();

  if (!doctor) {
    return null;
  }

  const handleDoctorSelect = (doctorId: string) => {
    setSelectedDoctorId(doctorId);
    setSelectedSlot(null);
  };

  const handleAgendarCita = () => {
    const selectedDoc = doctor.find(d => d._id === selectedDoctorId);
    if (!selectedDoc || !selectedSlot || !date) return;

    const payload: CreateCitaPayload = {
      medico_ID: selectedDoc.user._id,
      centroSalud_ID: selectedDoc.user.centroSalud_ID?._id || '',
      fecha: extractDateKey(date),
      hora: selectedSlot,
    };
    agendarCita(payload);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable className="flex-1 bg-black/50 justify-end" onPress={onClose}>
        <Pressable onPress={e => e.stopPropagation()}>
          <View className="bg-white rounded-t-[28px] pt-5 pb-8 max-h-[85%]">
            <View className="w-10 h-1 bg-zinc-200 rounded-full self-center mb-4" />

            <View className="flex-row items-center justify-between px-5 mb-1">
              <View>
                <TextField
                  variant="title"
                  className="text-[#0D0F1C] font-bold text-xl text-left"
                >
                  Elegí tu médico
                </TextField>
                {date && (
                  <TextField
                    variant="caption"
                    className="text-zinc-500 text-sm text-left mt-0.5"
                  >
                    {formatDate(date)}
                  </TextField>
                )}
              </View>
              <Pressable
                className="w-9 h-9 items-center justify-center rounded-full bg-zinc-100"
                onPress={onClose}
              >
                <Ionicons name="close" size={18} color="#3F3F46" />
              </Pressable>
            </View>

            <ScrollView
              className="mt-4"
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingBottom: 16,
              }}
              showsVerticalScrollIndicator={false}
            >
              {doctor.map(doc => (
                <DoctorCard
                  key={doc._id}
                  doctor={doc}
                  selectedSlot={selectedSlot}
                  isSelected={selectedDoctorId === doc._id}
                  onDoctorPress={handleDoctorSelect}
                  onSlotPress={slot => {
                    setSelectedDoctorId(doc._id);
                    setSelectedSlot(slot);
                  }}
                />
              ))}
            </ScrollView>

            <View className="px-5 pt-2">
              <Pressable
                className={`py-4 rounded-2xl items-center ${
                  selectedSlot ? 'bg-[#5B4CF5]' : 'bg-zinc-200'
                }`}
                disabled={!selectedSlot || isCreating}
                onPress={handleAgendarCita}
              >
                <TextField
                  variant="body"
                  className={`font-bold text-[16px] ${selectedSlot ? 'text-white' : 'text-zinc-400'}`}
                >
                  Agendar cita
                </TextField>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
