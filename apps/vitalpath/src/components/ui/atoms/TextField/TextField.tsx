import { Text, TextProps } from 'react-native';
import { getTextFieldStyle, type TextFieldVariant } from './TextField.variants';
import { useTheme } from '@/src/hooks/useTheme';

export interface TextFieldProps extends TextProps {
  children?: React.ReactNode;
  variant?: TextFieldVariant;
}

const TextField = ({
  children,
  variant = 'body',
  style,
  ...props
}: TextFieldProps) => {
  const t = useTheme();
  return (
    <Text style={[getTextFieldStyle(variant, t), style]} {...props}>
      {children}
    </Text>
  );
};

export default TextField;
