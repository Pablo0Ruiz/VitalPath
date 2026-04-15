import { View, TextInputProps, TextInput } from 'react-native';
import React, { ReactNode } from 'react';
import { inputVariants } from './Input.variants';

export interface InputProps extends TextInputProps {
  placeholder?: string;
  variant?: 'primary' | 'secondary';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Input = ({
  className,
  placeholder,
  variant = 'primary',
  leftIcon,
  rightIcon,
  ...props
}: InputProps) => {
  return (
    <View
      className={`flex-row items-center px-4 py-1 ${inputVariants({ variant })} ${className ?? ''}`}
    >
      {leftIcon && <View className="mr-3 opacity-50">{leftIcon}</View>}
      <TextInput
        className={`flex-1 py-3 text-base tracking-[0.3px] ${inputVariants({ variant })}`}
        placeholder={placeholder}
        placeholderTextColor="#gray"
        {...props}
      />
      {rightIcon && <View className="ml-3 opacity-50">{rightIcon}</View>}
    </View>
  );
};

export default Input;
