import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TextField } from '../../atoms';
import { useTheme } from '@/src/hooks/useTheme';
import type { CitaPopulated } from '@repo/types';

export interface AppointmentPreviewRowProps extends ViewProps {
  cita: CitaPopulated;
}

export const AppointmentPreviewRow = ({
  cita,
  style,
  ...props
}: AppointmentPreviewRowProps) => {
  const t = useTheme();
  return (
    <View
      testID={`appointment-preview-row-${cita._id}`}
      style={[s.row, { borderBottomColor: t.border }, style]}
      {...props}
    >
      <View style={[s.dateBox, { backgroundColor: t.primary50 }]}>
        <Ionicons name="calendar-outline" size={16} color={t.primary600} />
      </View>
      <View style={s.info}>
        <TextField
          variant="caption"
          style={{ fontSize: 12, color: t.textSecondary }}
        >
          {`${cita.fecha} — ${cita.hora}`}
        </TextField>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  dateBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  info: { flex: 1 },
});

export default AppointmentPreviewRow;
