import { Pressable, PressableProps, View } from 'react-native';
import Octicons from '@expo/vector-icons/Octicons';

import { checkboxVariants } from './Checkbox.variants';

export interface CheckboxProps extends PressableProps {
  checked: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const Checkbox = ({
  checked,
  onToggle,
  children,
  className,
  ...props
}: CheckboxProps) => {
  return (
    <Pressable
      onPress={onToggle}
      className={`flex-row items-start ${className ?? ''}`}
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
      {...props}
    >
      <View className={`${checkboxVariants({ checked })}`}>
        {checked && <Octicons name="check" size={14} color="white" />}
      </View>
      <View className="flex-1">{children}</View>
    </Pressable>
  );
};

export default Checkbox;
