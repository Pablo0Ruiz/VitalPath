import { CitaState } from 'src/appointment/dto/enum/cita-state.enum';

export const CITA_PUSH_COPY: Partial<
  Record<CitaState, { title: string; body: string }>
> = {
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
