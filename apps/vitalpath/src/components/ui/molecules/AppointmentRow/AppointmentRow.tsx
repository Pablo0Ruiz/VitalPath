import React from 'react';
import {
  StyleProp,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import { Avatar, Badge, TextField } from '../../atoms';
import { useTheme } from '@/src/hooks/useTheme';

export interface AppointmentRowProps extends ViewProps {
  doctor: string;
  specialty: string;
  time: string;
  date: string;
  avatarInitials: string;
  avatarStyle?: StyleProp<ViewStyle>;
}

const AppointmentRow = ({
  doctor,
  specialty,
  time,
  date,
  avatarInitials,
  avatarStyle,
  style,
  ...props
}: AppointmentRowProps) => {
  const t = useTheme();

  return (
    <View style={[s.base, style]} {...props}>
      <Avatar initials={avatarInitials} style={avatarStyle} />
      <View style={s.doctorInfo}>
        <TextField
          variant="body"
          style={[s.doctorName, { color: t.textPrimary }]}
        >
          {doctor}
        </TextField>
        <Badge label={specialty} variant="primary" style={s.badge} />
      </View>
      <View style={s.timeInfo}>
        <TextField variant="body" style={[s.timeText, { color: t.primary600 }]}>
          {time}
        </TextField>
        <TextField
          variant="caption"
          style={[s.dateText, { color: t.textSecondary }]}
        >
          {date}
        </TextField>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  base: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  doctorInfo: { flex: 1, marginLeft: 12 },
  doctorName: { fontSize: 14, fontWeight: '600' },
  badge: { alignSelf: 'flex-start', marginTop: 4 },
  timeInfo: { alignItems: 'flex-end', marginLeft: 8 },
  timeText: { fontSize: 14, fontWeight: '700' },
  dateText: { fontSize: 11, marginTop: 2 },
});

export default AppointmentRow;
