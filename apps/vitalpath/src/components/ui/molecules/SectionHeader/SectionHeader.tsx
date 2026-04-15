import { View, ViewProps } from 'react-native';
import { Button, TextField } from '../../atoms';

export interface SectionHeaderProps extends ViewProps {
  title: string;
  linkLabel?: string;
  onLinkPress?: () => void;
}

const SectionHeader = ({
  title,
  linkLabel,
  onLinkPress,
  className,
  ...props
}: SectionHeaderProps) => {
  return (
    <View
      className={`flex-row items-center justify-between mb-2.5 mt-1 ${className ?? ''}`}
      {...props}
    >
      <TextField
        variant="body"
        className="text-brand-slate-800 text-[17px] font-bold text-left"
      >
        {title}
      </TextField>
      {linkLabel && onLinkPress && (
        <Button onPress={onLinkPress}>
          <TextField
            variant="caption"
            className="text-brand-violet-600 font-semibold text-[13px]"
          >
            {linkLabel}
          </TextField>
        </Button>
      )}
    </View>
  );
};

export default SectionHeader;
