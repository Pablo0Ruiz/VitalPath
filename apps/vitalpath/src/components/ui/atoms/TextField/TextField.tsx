import { Text, TextProps } from 'react-native';
import { textFieldStyles, type TextFieldVariant } from './TextField.variants';

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
  return (
    <Text style={[textFieldStyles[variant], style]} {...props}>
      {children}
    </Text>
  );
};

export default TextField;
