import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TextField, TimeSlotChip } from '../../atoms';
import { DoctorSession } from '@repo/api-client';
import { useTheme } from '@/src/hooks/useTheme';
import { toTitleCase } from '@/src/utils/text';

interface DoctorCardProps {
  doctor: DoctorSession;
  selectedSlot: string | null;
  isSelected: boolean;
  onDoctorPress: (doctorId: string) => void;
  onSlotPress: (slot: string) => void;
}

export const DoctorCard = ({
  doctor,
  selectedSlot,
  isSelected,
  onDoctorPress,
  onSlotPress,
}: DoctorCardProps) => {
  const t = useTheme();

  return (
    <Pressable
      onPress={() => onDoctorPress(doctor._id)}
      style={({ pressed }) => [
        s.container,
        {
          borderColor: isSelected ? t.primary600 : t.border,
          backgroundColor: isSelected ? t.primary50 : t.surfaceElevated,
          opacity: pressed ? 0.9 : 1,
          shadowColor: '#000',
        },
      ]}
    >
      <View style={s.header}>
        <View style={[s.avatar, { backgroundColor: t.primary600 }]}>
          <TextField variant="caption" style={s.avatarText}>
            {doctor.user.name.slice(0, 2).toUpperCase()}
          </TextField>
        </View>
        <View style={s.info}>
          <TextField variant="body" style={[s.name, { color: t.textPrimary }]}>
            Dr. {toTitleCase(doctor.user.name)}{' '}
            {toTitleCase(doctor.user.lastName)}
          </TextField>
          <View style={s.specialtyWrapper}>
            <Ionicons name="medkit-outline" size={13} color={t.textSecondary} />
            <TextField
              variant="caption"
              style={[s.specialtyText, { color: t.textSecondary }]}
            >
              {toTitleCase(doctor.especialidad)} ·{' '}
              {doctor.user.centroSalud_ID?.nombre}
            </TextField>
          </View>
        </View>
      </View>

      <View style={s.slotsGrid}>
        {doctor.slots.map(slot => (
          <TimeSlotChip
            key={slot}
            slot={slot}
            isActive={isSelected && selectedSlot === slot}
            onPress={() => onSlotPress(slot)}
          />
        ))}
      </View>
    </Pressable>
  );
};

const s = StyleSheet.create({
  container: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontWeight: '700',
    fontSize: 14,
    color: '#FFFFFF',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'left',
  },
  specialtyWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 4,
  },
  specialtyText: {
    fontSize: 12,
    textAlign: 'left',
    flexShrink: 1,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});

export default DoctorCard;
