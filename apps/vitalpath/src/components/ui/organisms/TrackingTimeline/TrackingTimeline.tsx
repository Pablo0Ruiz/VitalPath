import { StyleSheet, View, ViewProps } from 'react-native';
import { TimelineStep, SecurityBanner } from '../../molecules';
import type { IMedicalResults } from '@repo/types';
import { formatDateHuman } from '@/src/utils/date';
import { toTitleCase } from '@/src/utils/text';

export interface TrackingTimelineProps extends ViewProps {
  onPrivacyPress?: () => void;
  resultado?: IMedicalResults;
}

type StepConfig = {
  s1: 'completed' | 'locked';
  s2: 'sample' | 'completed' | 'locked';
  s3: 'processing' | 'completed' | 'locked';
  s4: 'completed' | 'locked';
};

function deriveSteps(estado: string): StepConfig {
  if (estado === 'agendada')
    return { s1: 'locked', s2: 'locked', s3: 'locked', s4: 'locked' };
  if (estado === 'asistida')
    return { s1: 'completed', s2: 'sample', s3: 'locked', s4: 'locked' };
  if (estado === 'en_proceso')
    return { s1: 'completed', s2: 'completed', s3: 'processing', s4: 'locked' };
  if (estado === 'resultados_listos' || estado === 'completada')
    return {
      s1: 'completed',
      s2: 'completed',
      s3: 'completed',
      s4: 'completed',
    };
  return { s1: 'locked', s2: 'locked', s3: 'locked', s4: 'locked' };
}

const TrackingTimeline = ({
  onPrivacyPress,
  style,
  resultado,
  ...props
}: TrackingTimelineProps) => {
  if (!resultado) return null;

  const steps = deriveSteps(resultado.cita_ID?.estado || 'completada');
  const doctorName = `Dr. ${toTitleCase(resultado.medico_ID.name)} ${toTitleCase(resultado.medico_ID.lastName)}`;
  const fecha = resultado.cita_ID?.fecha
    ? formatDateHuman(resultado.cita_ID.fecha)
    : formatDateHuman(resultado.createdAt.slice(0, 10));

  const step3Completed = steps.s3 === 'completed';

  return (
    <View style={[s.container, style]} {...props}>
      <TimelineStep
        status={steps.s1}
        title="Cita realizada"
        time={resultado.cita_ID?.hora || ''}
        date={fecha}
        doctorName={doctorName}
      />

      <TimelineStep
        status={steps.s2}
        title="Muestra recibida"
        date={fecha}
        samples="La muestra fue recibida y enviada al laboratorio para su análisis."
        isLocked={steps.s2 === 'locked'}
      />

      <TimelineStep
        status={steps.s3}
        title={
          step3Completed ? 'Análisis completado' : 'En proceso de laboratorio'
        }
        progressLabel={!step3Completed ? 'ANÁLISIS' : undefined}
        progressValue={
          !step3Completed ? (steps.s3 === 'processing' ? 65 : 0) : undefined
        }
        isActive={steps.s3 === 'processing'}
        isLocked={steps.s3 === 'locked'}
      />

      <TimelineStep
        status={steps.s4}
        title="Resultados listos"
        doctorName={steps.s4 !== 'locked' ? doctorName : undefined}
        pendingNote={
          steps.s4 === 'locked'
            ? 'En espera de validación final.'
            : 'Tus resultados están disponibles.'
        }
        estimatedTime={steps.s4 === 'locked' ? '24 horas' : undefined}
        isLocked={steps.s4 === 'locked'}
        isLast
      />

      <SecurityBanner style={s.banner} onMorePress={onPrivacyPress} />
    </View>
  );
};

const s = StyleSheet.create({
  container: { width: '100%' },
  banner: { marginTop: 8 },
});

export default TrackingTimeline;
