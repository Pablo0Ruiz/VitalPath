import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TextField } from '../../atoms';
import { useTheme } from '@/src/hooks/useTheme';
import type { Medication } from '@repo/types';

export interface CompactMedRowProps extends ViewProps {
  med: Medication;
}

export const CompactMedRow = ({ med, style, ...props }: CompactMedRowProps) => {
  const t = useTheme();
  return (
    <View
      testID={`med-row-${med._id}`}
      style={[s.row, { borderBottomColor: t.border }, style]}
      {...props}
    >
      <View style={[s.dot, { backgroundColor: t.primary100 }]}>
        <Ionicons name="medical" size={12} color={t.primary600} />
      </View>
      <View style={s.info}>
        <TextField
          variant="body"
          style={{ fontSize: 13, fontWeight: '600', color: t.textPrimary }}
        >
          {med.name}
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
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  info: { flex: 1 },
});

export default CompactMedRow;
