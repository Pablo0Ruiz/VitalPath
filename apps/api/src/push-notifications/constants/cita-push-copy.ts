import { CitaState } from 'src/appointment/dto/enum/cita-state.enum';
import { Appointment } from 'src/appointment/entities/appointment.entity';

export type PushCopyEntry = {
  title: string;
  body: string | ((cita: Appointment) => string);
};

export const CITA_PUSH_COPY: Partial<Record<CitaState, PushCopyEntry>> = {
  [CitaState.AGENDADA]: {
    title: 'Cita agendada',
    body: (cita: Appointment) =>
      `Cita programada para el ${cita.fecha} a las ${cita.hora}.`,
  },
  [CitaState.ASISTIDA]: {
    title: 'Tu cita está en curso',
    body: 'El médico ya registró tu asistencia.',
  },
  [CitaState.EN_PROCESO]: {
    title: 'Estudio en proceso',
    body: 'Tu estudio clínico está siendo procesado.',
  },
  [CitaState.RESULTADOS_LISTOS]: {
    title: 'Resultados listos 🔬',
    body: 'Tus resultados clínicos ya están disponibles.',
  },
  [CitaState.COMPLETADA]: {
    title: 'Estudio completado',
    body: 'Tu estudio ha sido completado exitosamente.',
  },
};
