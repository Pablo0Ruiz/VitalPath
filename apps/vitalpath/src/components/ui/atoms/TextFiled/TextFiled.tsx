import { Text, TextProps } from 'react-native';
import { textFieldVariants } from './TextField.variants';

export interface TextFieldProps extends TextProps {
  children: React.ReactNode;
  variant?: 'title' | 'subtitle' | 'body' | 'caption' | 'label';
}

const TextField = ({
  children,
  className,
  variant = 'body',
  ...props
}: TextFieldProps) => {
  return (
    <Text
      className={`${textFieldVariants({ variant })} ${className ?? ''}`}
      {...props}
    >
      {children}
    </Text>
  );
};

export default TextField;
