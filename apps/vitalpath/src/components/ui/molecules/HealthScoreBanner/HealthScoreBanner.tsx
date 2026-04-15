import { View, ViewProps } from 'react-native';
import { Avatar, Tabs, TextField } from '../../atoms';

export type BannerProps = ViewProps;

const Banner = ({ className, ...props }: BannerProps) => {
  return (
    <View
      className={`bg-white rounded-[20px] p-4 flex-row  mb-4 ${
        className ?? ''
      }`}
      {...props}
    >
      <View className="items-start">
        <Tabs label="OCT 12" variant="date" className="ml-80" />
        <TextField
          variants="caption"
          className="text-slate-800 mb-1 text-left mt-2 text-xs"
        >
          Cita completada
        </TextField>
        <TextField
          variants="body"
          className="text-slate-800 font-extrabold text-[48px] leading-[52px]"
        >
          09:00 Am
        </TextField>
        <View className="flex-row items-center">
          <Avatar
            image={require('@/assets/images/vitalpath-logo.png')}
            size="md"
          />
          <TextField
            variants="caption"
            className="text-slate-800 mb-1 text-left mt-2 text-xs"
          >
            Nombre del doctor
          </TextField>
        </View>
      </View>
    </View>
  );
};

export default Banner;
