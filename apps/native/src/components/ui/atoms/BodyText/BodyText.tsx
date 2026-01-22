import { Text, TextProps } from 'react-native';
import { bodyTextVariants } from './BodyText.variants';

export interface BodyTextProps extends TextProps {
  text: string;
  variant?: 'title' | 'subtitle' | 'body';
}

const BodyText = ({
  text,
  variant = 'body',
  className,
  ...props
}: BodyTextProps) => {
  return (
    <Text
      className={`${bodyTextVariants.base} ${bodyTextVariants[variant]} ${className || ''}`}
      {...props}
    >
      {text}
    </Text>
  );
};

export default BodyText;
