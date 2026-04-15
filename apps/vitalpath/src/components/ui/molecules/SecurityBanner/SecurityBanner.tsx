import { View, ViewProps } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Button, TextField } from '@/src/components/ui/atoms';

export interface SecurityBannerProps extends ViewProps {
  onMorePress?: () => void;
}

const SecurityBanner = ({
  onMorePress,
  className,
  ...props
}: SecurityBannerProps) => {
  return (
    <View
      className={`bg-slate-900 rounded-2xl p-5 flex-row items-start gap-4 ${className ?? ''}`}
      {...props}
    >
      <View className="bg-slate-700 rounded-xl p-2 mt-1">
        <Feather name="lock" size={20} color="#fff" />
      </View>
      <View className="flex-1">
        <TextField
          variant="body"
          className="text-white font-bold text-base mb-1"
        >
          Seguridad de Nivel Médico
        </TextField>
        <TextField variant="caption" className="text-slate-600 leading-5 mb-3">
          Tus resultados están protegidos mediante cifrado AES-256 de extremo a
          extremo. Solo tú y tu médico tratante pueden acceder a esta
          información.
        </TextField>
        <Button onPress={onMorePress}>
          <TextField variant="caption" className="text-blue-400 font-semibold">
            Más sobre privacidad →
          </TextField>
        </Button>
      </View>
    </View>
  );
};

export default SecurityBanner;
