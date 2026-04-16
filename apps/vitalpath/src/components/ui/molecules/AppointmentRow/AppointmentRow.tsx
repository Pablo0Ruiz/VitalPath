import React from 'react';
import { View, ViewProps } from 'react-native';
import { Avatar, Badge, TextField } from '../../atoms';

export interface AppointmentRowProps extends ViewProps {
  doctor: string;
  specialty: string;
  time: string;
  date: string;
  avatarInitials: string;
  avatarClassName?: string;
}

const AppointmentRow = ({
  doctor,
  specialty,
  time,
  date,
  avatarInitials,
  avatarClassName,
  className,
  ...props
}: AppointmentRowProps) => {
  return (
    <View
      className={`flex-row items-center py-2 ${className ?? ''}`}
      {...props}
    >
      <Avatar initials={avatarInitials} className={avatarClassName} />
      <View className="flex-1 ml-3">
        <TextField
          variant="body"
          className="text-left font-semibold text-brand-slate-800 text-sm"
        >
          {doctor}
        </TextField>
        <Badge
          label={specialty}
          variant="primary"
          className="self-start mt-1"
        />
      </View>
      <View className="items-end ml-2">
        <TextField
          variant="body"
          className="text-brand-violet-600 font-bold text-sm"
        >
          {time}
        </TextField>
        <TextField
          variant="caption"
          className="text-brand-slate-400 text-[11px] mt-0.5"
        >
          {date}
        </TextField>
      </View>
    </View>
  );
};

export default AppointmentRow;
