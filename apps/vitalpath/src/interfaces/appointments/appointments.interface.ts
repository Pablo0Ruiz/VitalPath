export interface CreateCitaPayload {
  fechaHora: string;
  medico_ID: string;
  centroSalud_ID: string;
}

export interface UpdateCitaPayload {
  fechaHora?: string;
  medico_ID?: string;
  centroSalud_ID?: string;
  estado?: CitaEstado;
}

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
  fechaHora: string;
  estado: CitaEstado;
  createdAt: string;
  updatedAt: string;
}
