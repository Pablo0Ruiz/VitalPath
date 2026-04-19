import { useState } from 'react';
import { Modal, View, Pressable, ScrollView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TextField } from '../../atoms';

interface MockDoctor {
  id: string;
  name: string;
  specialty: string;
  slots: string[];
  avatarColor: string;
  initials: string;
}

const MOCK_DOCTORS: MockDoctor[] = [
  {
    id: '1',
    name: 'Dra. Ana Martínez',
    specialty: 'Cardiología',
    slots: ['09:00', '10:30', '15:00'],
    avatarColor: '#EDE9FE',
    initials: 'AM',
  },
  {
    id: '2',
    name: 'Dr. Luis Herrera',
    specialty: 'Medicina General',
    slots: ['08:00', '11:00', '16:30'],
    avatarColor: '#D1FAE5',
    initials: 'LH',
  },
  {
    id: '3',
    name: 'Dra. Sofia Blanco',
    specialty: 'Nutrición',
    slots: ['10:00', '13:00', '17:00'],
    avatarColor: '#FEF3C7',
    initials: 'SB',
  },
];

const DAY_NAMES = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];
const MONTH_NAMES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

function formatDate(date: Date): string {
  return `${DAY_NAMES[date.getDay()]}, ${date.getDate()} de ${MONTH_NAMES[date.getMonth()]}`;
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

  const handleDoctorSelect = (doctorId: string) => {
    setSelectedDoctorId(doctorId);
    setSelectedSlot(null);
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
              {MOCK_DOCTORS.map(doctor => (
                <Pressable
                  key={doctor.id}
                  onPress={() => handleDoctorSelect(doctor.id)}
                  className={`mb-3 p-4 rounded-2xl border ${
                    selectedDoctorId === doctor.id
                      ? 'border-[#5B4CF5] bg-[#F5F4FF]'
                      : 'border-zinc-100 bg-white'
                  }`}
                  style={{
                    elevation: 1,
                    shadowColor: '#000',
                    shadowOpacity: 0.04,
                    shadowRadius: 4,
                    shadowOffset: { width: 0, height: 2 },
                  }}
                >
                  <View className="flex-row items-center mb-3">
                    <View
                      className="w-11 h-11 rounded-full items-center justify-center mr-3"
                      style={{ backgroundColor: doctor.avatarColor }}
                    >
                      <TextField
                        variant="caption"
                        className="font-bold text-sm text-[#3F3F46]"
                      >
                        {doctor.initials}
                      </TextField>
                    </View>
                    <View className="flex-1">
                      <TextField
                        variant="body"
                        className="text-[#0D0F1C] font-semibold text-[15px] text-left"
                      >
                        {doctor.name}
                      </TextField>
                      <View className="flex-row items-center gap-1 mt-0.5">
                        <Ionicons
                          name="medkit-outline"
                          size={13}
                          color="#71717A"
                        />
                        <TextField
                          variant="caption"
                          className="text-zinc-500 text-xs text-left"
                        >
                          {doctor.specialty}
                        </TextField>
                      </View>
                    </View>
                  </View>

                  <FlatList
                    data={doctor.slots}
                    horizontal
                    keyExtractor={slot => slot}
                    showsHorizontalScrollIndicator={false}
                    scrollEnabled={false}
                    renderItem={({ item: slot }) => {
                      const isActive =
                        selectedDoctorId === doctor.id && selectedSlot === slot;
                      return (
                        <Pressable
                          onPress={() => {
                            setSelectedDoctorId(doctor.id);
                            setSelectedSlot(slot);
                          }}
                          className={`mr-2 px-4 py-2 rounded-full ${
                            isActive ? 'bg-[#5B4CF5]' : 'bg-zinc-100'
                          }`}
                        >
                          <TextField
                            variant="caption"
                            className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-zinc-700'}`}
                          >
                            {slot}
                          </TextField>
                        </Pressable>
                      );
                    }}
                    ItemSeparatorComponent={() => null}
                  />
                </Pressable>
              ))}
            </ScrollView>

            <View className="px-5 pt-2">
              <Pressable
                className={`py-4 rounded-2xl items-center ${
                  selectedSlot ? 'bg-[#5B4CF5]' : 'bg-zinc-200'
                }`}
                disabled={!selectedSlot}
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
