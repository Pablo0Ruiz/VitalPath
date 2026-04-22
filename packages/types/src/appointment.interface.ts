export type CitaEstado =
  | 'agendada'
  | 'asistida'
  | 'en_proceso'
  | 'resultados_listos'
  | 'completada'
  | 'cancelada';

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

export interface CitaPopulated extends Omit<
  Cita,
  'medico_ID' | 'centroSalud_ID'
> {
  medico_ID: CitaMedicoPopulated;
  centroSalud_ID: CitaCentroSaludPopulated;
}
