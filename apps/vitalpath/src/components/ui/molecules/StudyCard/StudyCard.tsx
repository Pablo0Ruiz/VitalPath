import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Card } from '@/src/components/ui/atoms/Card';
import { Badge } from '@/src/components/ui/atoms/Badge';
import { TextField } from '@/src/components/ui/atoms/TextField';
import type { IMedicalResults } from '@repo/types';
import type { BadgeVariant } from '@/src/components/ui/atoms/Badge/Badge.variants';
import { useTheme } from '@/src/hooks/useTheme';

interface StudyCardProps {
  study: IMedicalResults;
  onPress: () => void;
}

function getEstadoBadge(estado: string): {
  label: string;
  variant: BadgeVariant;
} {
  switch (estado) {
    case 'asistida':
      return { label: 'Iniciado', variant: 'primary' };
    case 'en_proceso':
      return { label: 'En proceso', variant: 'primary' };
    case 'resultados_listos':
      return { label: 'Resultados listos', variant: 'success' };
    case 'completada':
      return { label: 'Completado', variant: 'secondary' };
    default:
      return { label: 'Pendiente', variant: 'neutral' };
  }
}

const StudyCard = ({ study, onPress }: StudyCardProps) => {
  const t = useTheme();
  const badge = getEstadoBadge(study.cita_ID.estado);
  const doctorName = `Dr. ${study.medico_ID.name} ${study.medico_ID.lastName}`;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={s.touchable}>
      <Card variant="elevated" padding="md" style={s.card}>
        <View style={s.content}>
          <TextField
            variant="body"
            style={[s.doctorName, { color: t.textPrimary }]}
          >
            {doctorName}
          </TextField>
          <TextField
            variant="caption"
            style={[s.date, { color: t.textSecondary }]}
          >
            {study.cita_ID.fecha}
          </TextField>
        </View>
        <View style={s.actions}>
          <Badge label={badge.label} variant={badge.variant} />
          <Ionicons name="chevron-forward" size={16} color={t.textSecondary} />
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const s = StyleSheet.create({
  touchable: { marginBottom: 12 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  content: { flex: 1, gap: 2 },
  doctorName: { fontWeight: '600', fontSize: 15, textAlign: 'left' },
  date: { fontSize: 12, textAlign: 'left' },
  actions: { alignItems: 'flex-end', gap: 8 },
});

export default StudyCard;
