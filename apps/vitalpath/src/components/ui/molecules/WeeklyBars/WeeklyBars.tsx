import { StyleSheet, View, ViewProps } from 'react-native';
import { TextField } from '../../atoms';
import { useTheme } from '@/src/hooks/useTheme';

export interface WeeklyBarsProps extends ViewProps {
  data: number[];
  title: string;
  subtitle: string;
  todayLabel: string;
  goalLabel: string;
  goalPercentage: string;
}

const WeeklyBars = ({
  data,
  title,
  subtitle,
  todayLabel,
  goalLabel,
  goalPercentage,
  style,
  ...props
}: WeeklyBarsProps) => {
  const t = useTheme();
  const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const max = Math.max(...data);
  const chartH = 60;

  return (
    <View
      style={[
        s.container,
        { backgroundColor: t.surfaceElevated, borderColor: t.border },
        style,
      ]}
      {...props}
    >
      <View style={s.header}>
        <View>
          <TextField variant="body" style={[s.title, { color: t.textPrimary }]}>
            {title}
          </TextField>
          <TextField
            variant="caption"
            style={[s.subtitle, { color: t.textSecondary }]}
          >
            {subtitle}
          </TextField>
        </View>
        <View style={[s.badge, { backgroundColor: t.primary100 }]}>
          <TextField
            variant="caption"
            style={[s.badgeText, { color: t.primary700 }]}
          >
            {todayLabel}
          </TextField>
        </View>
      </View>

      <View style={s.chart}>
        {data.map((val, i) => {
          const barH = Math.max(4, (val / max) * chartH);
          const isToday = i === 4;
          return (
            <View key={i} style={s.barWrapper}>
              <View
                style={[
                  s.bar,
                  {
                    height: barH,
                    backgroundColor: isToday ? t.primary600 : t.primary100,
                  },
                ]}
              />
              <TextField
                variant="caption"
                style={[
                  s.dayText,
                  { color: isToday ? t.primary600 : t.textSecondary },
                  isToday && s.bold,
                ]}
              >
                {days[i]}
              </TextField>
            </View>
          );
        })}
      </View>

      <View style={s.footer}>
        <TextField
          variant="caption"
          style={[s.goalLabel, { color: t.textSecondary }]}
        >
          {goalLabel}
        </TextField>
        <TextField
          variant="caption"
          style={[s.goalValue, { color: t.primary700 }]}
        >
          {goalPercentage}
        </TextField>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: { fontSize: 15, fontWeight: '700', textAlign: 'left' },
  subtitle: { fontSize: 12, textAlign: 'left', marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99 },
  badgeText: { fontWeight: '700', fontSize: 11 },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  barWrapper: { alignItems: 'center', gap: 6 },
  bar: { width: 22, borderRadius: 6 },
  dayText: { fontSize: 10 },
  bold: { fontWeight: '800' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  goalLabel: { fontSize: 12 },
  goalValue: { fontWeight: '700', fontSize: 12 },
});

export default WeeklyBars;
