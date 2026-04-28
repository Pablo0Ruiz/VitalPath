import { useState } from 'react';
import { Modal, View, Pressable, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TextField } from '../../atoms';
import { useCreateCita, useDoctors } from '@repo/api-client';
import { CreateCitaPayload } from '@repo/types';
import { extractDateKey } from '@/src/utils/date';
import { MONTH_NAMES } from '@/src/constants/monthAndDay';
import { DoctorCard } from '../DoctorCard/DoctorCard';
import { useTheme } from '@/src/hooks/useTheme';

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
  const t = useTheme();
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const { data: doctor } = useDoctors();
  const { mutateAsync: createCita, isPending: isCreating } = useCreateCita();

  if (!doctor) {
    return null;
  }

  const handleDoctorSelect = (doctorId: string) => {
    setSelectedDoctorId(doctorId);
    setSelectedSlot(null);
  };

  const handleAgendarCita = async () => {
    const selectedDoc = doctor.find(d => d._id === selectedDoctorId);
    if (!selectedDoc || !selectedSlot || !date) return;

    const payload: CreateCitaPayload = {
      medico_ID: selectedDoc.user._id,
      centroSalud_ID: selectedDoc.user.centroSalud_ID?._id || '',
      fecha: extractDateKey(date),
      hora: selectedSlot,
    };
    await createCita(payload);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={s.overlay} onPress={onClose}>
        <Pressable onPress={e => e.stopPropagation()} style={s.sheet}>
          <View style={[s.content, { backgroundColor: t.surfaceElevated }]}>
            <View style={[s.handle, { backgroundColor: t.border }]} />

            <View style={s.header}>
              <View>
                <TextField
                  variant="title"
                  style={[s.title, { color: t.textPrimary }]}
                >
                  Elegí tu médico
                </TextField>
                {date && (
                  <TextField
                    variant="caption"
                    style={[s.subtitle, { color: t.textSecondary }]}
                  >
                    {formatDate(date)}
                  </TextField>
                )}
              </View>
              <Pressable
                style={[s.closeButton, { backgroundColor: t.neutral100 }]}
                onPress={onClose}
              >
                <Ionicons name="close" size={18} color={t.neutral600} />
              </Pressable>
            </View>

            <FlatList
              style={s.list}
              data={doctor}
              keyExtractor={doc => doc._id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={s.listContent}
              renderItem={({ item: doc }) => (
                <DoctorCard
                  doctor={doc}
                  selectedSlot={selectedSlot}
                  isSelected={selectedDoctorId === doc._id}
                  onDoctorPress={handleDoctorSelect}
                  onSlotPress={slot => {
                    setSelectedDoctorId(doc._id);
                    setSelectedSlot(slot);
                  }}
                />
              )}
            />

            <View style={s.footer}>
              <Pressable
                style={[
                  s.submitButton,
                  {
                    backgroundColor: selectedSlot ? t.primary600 : t.neutral200,
                  },
                ]}
                disabled={!selectedSlot || isCreating}
                onPress={handleAgendarCita}
              >
                <TextField
                  variant="body"
                  style={[
                    s.submitText,
                    { color: selectedSlot ? '#FFFFFF' : t.neutral400 },
                  ]}
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

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: { width: '100%' },
  content: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 16,
    paddingBottom: 32,
    maxHeight: '85%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  title: { fontSize: 20, fontWeight: '700', textAlign: 'left' },
  subtitle: { fontSize: 14, textAlign: 'left', marginTop: 2 },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: { marginTop: 12 },
  listContent: { paddingHorizontal: 20, paddingBottom: 16 },
  footer: { paddingHorizontal: 20, paddingTop: 12 },
  submitButton: { paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  submitText: { fontWeight: '700', fontSize: 16 },
});
