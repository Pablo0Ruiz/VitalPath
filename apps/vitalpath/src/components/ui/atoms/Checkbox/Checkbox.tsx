import { Pressable, PressableProps, View } from 'react-native';
import Octicons from '@expo/vector-icons/Octicons';
import React, { ReactNode } from 'react';

export interface CheckboxProps extends PressableProps {
  checked: boolean;
  onToggle: () => void;
  children: ReactNode;
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
      <View
        className={`w-6 h-6 rounded-md border-2 mr-3 items-center justify-center ${
          checked
            ? 'bg-brand-violet-600 border-brand-violet-600'
            : 'border-brand-slate-200 bg-white'
        }`}
      >
        {checked && <Octicons name="check" size={14} color="white" />}
      </View>
      <View className="flex-1">{children}</View>
    </Pressable>
  );
};

export default Checkbox;
