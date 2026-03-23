import { View, Image, ViewProps } from 'react-native';
import { TextField } from '../../atoms';

interface AuthHeaderProps extends ViewProps {
  title: string;
  subtitle?: string;
}

const AuthHeader = ({ title, subtitle, className }: AuthHeaderProps) => {
  return (
    <View className={className ?? ''}>
      <View className="items-center justify-center mt-1">
        <Image
          source={require('@/assets/images/vitalpath-logo.png')}
          className="w-64 h-64"
        />
      </View>

      <TextField variants="title">{title}</TextField>

      {subtitle && (
        <TextField
          variants="caption"
          className="text-sm text-brand-slate-500 mb-8"
        >
          {subtitle}
        </TextField>
      )}
    </View>
  );
};

export default AuthHeader;
