import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CitaState } from './enum/cita-state.enum';

export class UpdateCitaEstadoDto {
  @ApiProperty({
    enum: CitaState,
    example: CitaState.ASISTIDA,
    description: 'New appointment state',
  })
  @IsEnum(CitaState, { message: 'Estado inválido' })
  estado: CitaState;
}
