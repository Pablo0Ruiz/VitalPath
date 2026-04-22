import { PressableProps, View } from 'react-native';
import { Button } from '../Button';
import { Avatar } from '../Avatar';
import { TextField } from '../TextFiled';

export interface HeaderHomeProps extends PressableProps {
  textLabel: string;
  onLogaut?: () => void;
  nameUser: string | undefined;
}

const HeaderHome = ({
  textLabel = 'textLabel example',
  onLogaut,
  nameUser = 'example',
  className,
}: HeaderHomeProps) => {
  return (
    <Button variant="ghost" onLongPress={onLogaut} className={className}>
      <Avatar
        image={require('@/assets/images/vitalpath-logo.png')}
        size="md"
        className="bg-brand-violet-50"
      />
      <View className="ml-3">
        <TextField
          variant="caption"
          className="text-brand-slate-400 text-left text-xs"
        >
          {textLabel}
        </TextField>
        <TextField
          variant="body"
          className="text-brand-slate-900 font-semibold text-left text-[15px]"
        >
          {nameUser}
        </TextField>
      </View>
    </Button>
  );
};

export default HeaderHome;
