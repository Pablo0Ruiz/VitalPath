import { Pressable, PressableProps, Text } from 'react-native';
import { TextField } from '@/src/components/ui/atoms/TextFiled';

export interface SocialButtonProps extends PressableProps {
  label?: string;
  icon?: React.ReactNode;
}

const SocialButton = ({
  label,
  icon,
  className,
  ...props
}: SocialButtonProps) => {
  const labelDefault = label ?? icon;

  return (
    <Pressable
      {...props}
      className="flex-1 items-center justify-center rounded-xl border border-brand-slate-200 bg-white py-3"
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
    >
      <TextField variants="body" className="font-semibold ">
        {labelDefault}
      </TextField>
    </Pressable>
  );
};

export default SocialButton;
