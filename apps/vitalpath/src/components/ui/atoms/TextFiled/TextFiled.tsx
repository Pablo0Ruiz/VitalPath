import { Text, TextProps } from 'react-native';

export interface TextFiledProps extends TextProps {
  children: React.ReactNode;
  variants?: 'title' | 'body' | 'caption';
}

const textFiledVariants = {
  title: 'text-center text-3xl font-bold text-brand-slate-900 mb-1',
  body: 'text-center text-base font-medium text-brand-slate-700',
  caption: 'text-center text-xs font-medium text-brand-slate-400',
};

const TextFiled = ({
  children,
  className,
  variants = 'body',
  ...props
}: TextFiledProps) => {
  return (
    <Text className={`${textFiledVariants[variants]} ${className}`} {...props}>
      {children}
    </Text>
  );
};

export default TextFiled;
