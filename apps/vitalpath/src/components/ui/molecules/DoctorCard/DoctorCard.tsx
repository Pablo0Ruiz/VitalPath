import { View, Pressable, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TextField, TimeSlotChip } from '../../atoms';
import { DoctorSession } from '@repo/api-client';

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
  return (
    <Pressable
      onPress={() => onDoctorPress(doctor._id)}
      className={`mb-3 p-4 rounded-2xl border ${
        isSelected
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
        <View className="w-11 h-11 rounded-full items-center justify-center mr-3 bg-brand-violet-600">
          <TextField variant="caption" className="font-bold text-sm text-white">
            {doctor.user.name.slice(0, 2).toUpperCase()}
          </TextField>
        </View>
        <View className="flex-1">
          <TextField
            variant="body"
            className="text-[#0D0F1C] font-semibold text-[15px] text-left"
          >
            {doctor.user.name} {doctor.user.lastName}
          </TextField>
          <View className="flex-row items-center gap-1 mt-0.5">
            <Ionicons name="medkit-outline" size={13} color="#71717A" />
            <TextField
              variant="caption"
              className="text-zinc-500 text-xs text-left"
            >
              {doctor.especialidad} - {doctor.user.centroSalud_ID?.nombre}
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
        renderItem={({ item: slot }) => (
          <TimeSlotChip
            slot={slot}
            isActive={isSelected && selectedSlot === slot}
            onPress={() => onSlotPress(slot)}
          />
        )}
      />
    </Pressable>
  );
};

export default DoctorCard;
