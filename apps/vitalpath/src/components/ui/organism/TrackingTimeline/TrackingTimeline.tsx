import React from 'react';
import { View, ViewProps } from 'react-native';
import { TimelineStep, SecurityBanner } from '../../molecules';

export interface TrackingTimelineProps extends ViewProps {
  onPrivacyPress?: () => void;
}

const TrackingTimeline = ({
  onPrivacyPress,
  className,
  ...props
}: TrackingTimelineProps) => {
  return (
    <View className={`${className ?? ''}`} {...props}>
      <TimelineStep
        status="completed"
        title="Cita Completada"
        time="09:00 AM"
        date="OCT 12"
        doctorName="Dr. Arisveth Mendoza"
        // doctorImage={require('@/assets/images/doctor.png')}
      />

      <TimelineStep
        status="sample"
        title="Muestra Tomada"
        time="09:15 AM"
        date="OCT 12"
        samples="Hemoglobina Glicosilada, Perfil Lipídico."
      />

      <TimelineStep
        status="processing"
        title="En Proceso de Laboratorio"
        time="Iniciado Oct 12, 11:30 AM"
        progressLabel="ANÁLISIS MOLECULAR"
        progressValue={65}
        isActive
      />

      <TimelineStep
        status="locked"
        title="Resultados Listos"
        pendingNote="En espera de encriptación y validación final."
        estimatedTime="24 horas"
        isLocked
        isLast
      />

      <SecurityBanner className="mt-2" onMorePress={onPrivacyPress} />
    </View>
  );
};

export default TrackingTimeline;
