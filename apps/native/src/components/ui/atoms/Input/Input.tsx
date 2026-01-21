import { Text, TextInput, TextInputProps, View } from 'react-native';
import { inputVariants } from './Input.variants';

export interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  secureTextEntry?: boolean;
  value?: string;
  onChangeText: () => void;
  keyboardType?: TextInputProps['keyboardType'];
  placeholder?: string;
  icon?: React.ReactNode;
}

const Input = ({
  label,
  error,
  secureTextEntry,
  keyboardType = 'default',
  onChangeText,
  placeholder,
  value,
  icon,
  className,
  ...props
}: InputProps) => {
  return (
    <View className={`${inputVariants.base} ${className}`}>
      <Text>{label}</Text>
      <TextInput
        value={value}
        accessible
        accessibilityLabel={label}
        accessibilityHint={placeholder}
        keyboardType={keyboardType}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        onChange={onChangeText}
        className={`${inputVariants.base} ${className}`}
        {...props}
      />
      {error && (
        <Text className={`${inputVariants.error} ${className}`}>{error}</Text>
      )}
      {icon}
    </View>
  );
};

export default Input;
