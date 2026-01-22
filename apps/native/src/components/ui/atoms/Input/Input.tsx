import { Text, TextInput, TextInputProps, View } from 'react-native';
import { inputVariants } from './Input.variants';

export interface InputProps extends TextInputProps {
  error?: string;
  secureTextEntry?: boolean;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: TextInputProps['keyboardType'];
  placeholder?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  label?: string;
}

const Input = ({
  error,
  secureTextEntry,
  keyboardType = 'default',
  onChangeText,
  placeholder,
  value,
  icon,
  rightIcon,
  label,
  className,
  ...props
}: InputProps) => {
  return (
    <View className={inputVariants.container}>
      {label && <Text className={inputVariants.label}>{label}</Text>}
      <View className={inputVariants.inputWrapper}>
        {icon && <View className={inputVariants.iconLeft}>{icon}</View>}
        <TextInput
          value={value}
          accessible
          accessibilityLabel={label}
          accessibilityHint={placeholder}
          keyboardType={keyboardType}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          secureTextEntry={secureTextEntry}
          onChangeText={onChangeText}
          className={`${inputVariants.base} ${icon ? 'pl-12' : ''} ${rightIcon ? 'pr-12' : ''} ${className ?? ''}`}
          {...props}
        />
        {rightIcon && (
          <View className={inputVariants.iconRight}>{rightIcon}</View>
        )}
      </View>
      {error && <Text className={inputVariants.error}>{error}</Text>}
    </View>
  );
};

export default Input;
