import { View, ViewProps } from 'react-native';
import { TextField } from '../../atoms';
import { dividerVariants, dividerVariantsDivider } from './Divider.variants';

interface DividerProps extends ViewProps {
  text?: string;
}

const Divider = ({ text, className, ...props }: DividerProps) => {
  if (!text) {
    return (
      <View
        {...props}
        className={`${dividerVariants.line.container} ${className ?? ''}`}
      />
    );
  }

  return (
    <View
      {...props}
      className={`${dividerVariants.text.container} ${className ?? ''}`}
    >
      <View className={dividerVariantsDivider} />
      <TextField
        variant="caption"
        className="mx-3 text-xs text-brand-slate-400"
      >
        {text}
      </TextField>
      <View className={dividerVariantsDivider} />
    </View>
  );
};

export default Divider;
