import { View, TextInputProps, TextInput } from 'react-native';
import { VariantProps } from 'class-variance-authority';

import { inputVariantsContainer, inputVariantsText } from './Input.variants';

export interface InputProps
  extends TextInputProps, VariantProps<typeof inputVariantsContainer> {
  placeholder?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
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
      className={`${inputVariantsContainer({ variant })} ${className ?? ''}`}
    >
      {leftIcon && <View className="mr-3 opacity-50">{leftIcon}</View>}
      <TextInput
        className={`${inputVariantsText({ variant })}`}
        placeholder={placeholder}
        placeholderTextColor="#gray"
        {...props}
      />
      {rightIcon && <View className="ml-3 opacity-50">{rightIcon}</View>}
    </View>
  );
};

export default Input;
