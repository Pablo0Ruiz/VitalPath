export type CitaEstado =
  | 'agendada'
  | 'asistida'
  | 'en_proceso'
  | 'resultados_listos'
  | 'completada'
  | 'cancelada';

export const CitaEstadoEnum = {
  AGENDADA: 'agendada',
  ASISTIDA: 'asistida',
  EN_PROCESO: 'en_proceso',
  RESULTADOS_LISTOS: 'resultados_listos',
  COMPLETADA: 'completada',
  CANCELADA: 'cancelada',
} as const;

export interface Cita {
  _id: string;
  paciente_ID: string;
  medico_ID: string;
  centroSalud_ID: string;
  fecha: string;
  hora: string;
  estado: CitaEstado;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCitaPayload {
  fecha: string;
  hora: string;
  medico_ID: string;
  centroSalud_ID: string;
}

export interface UpdateCitaPayload {
  fecha?: string;
  hora?: string;
  medico_ID?: string;
  centroSalud_ID?: string;
  estado?: CitaEstado;
}

export interface CitaMedicoPopulated {
  _id: string;
  name: string;
  lastName: string;
  especialidad: string;
}

export interface CitaCentroSaludPopulated {
  _id: string;
  nombre: string;
  direccion: string;
}

export interface CitaPacientePopulated {
  _id: string;
  name: string;
  lastName: string;
}

export interface CitaPopulated extends Omit<
  Cita,
  'medico_ID' | 'centroSalud_ID' | 'paciente_ID'
> {
  medico_ID: CitaMedicoPopulated;
  centroSalud_ID: CitaCentroSaludPopulated;
  paciente_ID: CitaPacientePopulated;
}

export const CITA_ALLOWED_TRANSITIONS: Partial<Record<CitaEstado, CitaEstado>> =
  {
    [CitaEstadoEnum.AGENDADA]: CitaEstadoEnum.ASISTIDA,
    [CitaEstadoEnum.ASISTIDA]: CitaEstadoEnum.EN_PROCESO,
    [CitaEstadoEnum.EN_PROCESO]: CitaEstadoEnum.RESULTADOS_LISTOS,
    [CitaEstadoEnum.RESULTADOS_LISTOS]: CitaEstadoEnum.COMPLETADA,
  };
