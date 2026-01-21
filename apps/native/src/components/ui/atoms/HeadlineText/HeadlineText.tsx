import { Text, TextProps } from 'react-native';
import { headlineTextVariants } from './HeadlineText.variants';

export interface HeadlineTextProps extends TextProps {
  text: string;
  highlightedText?: string;
}

const HeadlineText = ({
  text,
  highlightedText,
  className,
  ...props
}: HeadlineTextProps) => {
  if (!highlightedText) {
    return (
      <Text
        className={`${headlineTextVariants.base} ${className || ''}`}
        {...props}
      >
        {text}
      </Text>
    );
  }

  const parts = text.split(highlightedText);

  return (
    <Text
      className={`${headlineTextVariants.base} ${className || ''}`}
      {...props}
    >
      {parts[0]}
      <Text className={headlineTextVariants.highlight}>{highlightedText}</Text>
      {parts[1]}
    </Text>
  );
};

export default HeadlineText;
