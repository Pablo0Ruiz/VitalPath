export type EstadoVinculo = 'PENDIENTE' | 'ACTIVO' | 'REVOCADO';
export type TipoVinculo =
  | 'HIJO_A'
  | 'ESPOSO_A'
  | 'CUIDADOR_CONTRATADO'
  | 'OTRO';

export interface Vinculacion {
  _id: string;
  paciente_id: string;
  cuidador_id: string | null;
  tipo_vinculo: TipoVinculo | null;
  estado_vinculo: EstadoVinculo;
  createdAt: string;
  updatedAt: string;
}

export interface VinculacionUserPopulated {
  _id: string;
  name: string;
  lastName: string;
  fotoPerfil?: string;
  fechaNacimiento?: string;
}

export interface VinculacionConCuidador extends Omit<
  Vinculacion,
  'cuidador_id'
> {
  cuidador_id: VinculacionUserPopulated;
}

export interface VinculacionConPaciente extends Omit<
  Vinculacion,
  'paciente_id'
> {
  paciente_id: VinculacionUserPopulated;
}

export interface GenerarCodigoResponse {
  codigo: string;
  expireAt: string;
}

export interface VincularPayload {
  codigo: string;
  tipo_vinculo: TipoVinculo;
}
