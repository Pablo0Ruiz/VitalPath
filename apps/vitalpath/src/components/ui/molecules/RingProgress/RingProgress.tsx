import { Octicons, FontAwesome } from '@expo/vector-icons';
import { TextField } from '../../atoms';
import { View, ViewProps } from 'react-native';

export interface RingProgressProps extends ViewProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  label: string;
  unit: string;
}

const RingProgress = ({
  value,
  size = 88,
  unit,
  className,
  ...props
}: RingProgressProps) => {
  return (
    <View
      {...props}
      style={{ width: size, height: size }}
      className={className}
    >
      <FontAwesome name="heart" size={size} color="white" />
      <Octicons name="heart-fill" size={size} color="white" />
      <View className="absolute inset-0 items-center justify-center">
        <TextField
          variants="caption"
          className="text-white font-bold text-[16px]"
        >
          {value}
        </TextField>
        <TextField
          variants="caption"
          className="text-white text-[9px] opacity-80"
        >
          {unit}
        </TextField>
      </View>
    </View>
  );
};

export default RingProgress;
