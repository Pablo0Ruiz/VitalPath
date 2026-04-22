import { Pressable, Text } from 'react-native';

interface TimeSlotChipProps {
  slot: string;
  isActive: boolean;
  onPress: () => void;
}

export const TimeSlotChip = ({
  slot,
  isActive,
  onPress,
}: TimeSlotChipProps) => {
  return (
    <Pressable
      onPress={onPress}
      className={`px-4 py-2 rounded-full mr-2 ${
        isActive ? 'bg-[#5B4CF5]' : 'bg-zinc-100'
      }`}
    >
      <Text
        className={`text-sm font-medium ${
          isActive ? 'text-white' : 'text-zinc-700'
        }`}
      >
        {slot}
      </Text>
    </Pressable>
  );
};

export default TimeSlotChip;
