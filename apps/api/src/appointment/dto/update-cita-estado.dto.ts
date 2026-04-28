import { IsEnum } from 'class-validator';
import { CitaState } from './enum/cita-state.enum';

export class UpdateCitaEstadoDto {
  @IsEnum(CitaState, { message: 'Estado inválido' })
  estado: CitaState;
}
