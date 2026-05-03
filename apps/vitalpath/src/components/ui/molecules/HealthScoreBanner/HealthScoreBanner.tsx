import { StyleSheet, View, ViewProps } from 'react-native';
import { Avatar, Tabs, TextField } from '../../atoms';
import { useTheme } from '@/src/hooks/useTheme';

export type BannerProps = ViewProps;

const Banner = ({ style, ...props }: BannerProps) => {
  const t = useTheme();

  return (
    <View
      style={[s.container, { backgroundColor: t.surfaceElevated }, style]}
      {...props}
    >
      <View style={s.content}>
        <View style={s.header}>
          <Tabs label="OCT 12" variant="date" />
        </View>

        <TextField
          variant="caption"
          style={[s.status, { color: t.textSecondary }]}
        >
          Cita completada Cita completada
        </TextField>

        <TextField variant="body" style={[s.time, { color: t.textPrimary }]}>
          09:00 Am
        </TextField>

        <View style={s.doctorWrapper}>
          <Avatar image={require('@/assets/images/new-logo.png')} size="md" />
          <TextField
            variant="caption"
            style={[s.doctorName, { color: t.textSecondary }]}
          >
            Nombre del doctor
          </TextField>
        </View>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  content: { alignItems: 'flex-start' },
  header: { width: '100%', alignItems: 'flex-end', marginBottom: 8 },
  status: { fontSize: 12, textAlign: 'left', marginBottom: 4 },
  time: { fontSize: 44, fontWeight: '800', lineHeight: 48, marginBottom: 12 },
  doctorWrapper: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  doctorName: { fontSize: 13, fontWeight: '500' },
});

export default Banner;
