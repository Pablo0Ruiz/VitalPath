import { Text, TextProps } from 'react-native';
import { bodyTextVariants } from './BodyText.variants';

export interface BodyTextProps extends TextProps {
  text: string;
}

const BodyText = ({ text, className, ...props }: BodyTextProps) => {
  return (
    <Text className={`${bodyTextVariants.base} ${className || ''}`} {...props}>
      {text}
    </Text>
  );
};

export default BodyText;
