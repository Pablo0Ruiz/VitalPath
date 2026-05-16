import { PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CitaState } from 'src/appointment/dto/enum/cita-state.enum';
import { CreateAppointmentDto } from './create-appointment.dto';

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
  @ApiPropertyOptional({ enum: CitaState, example: CitaState.AGENDADA })
  @IsOptional()
  @IsEnum(CitaState, { message: 'Estado inválido' })
  estado?: CitaState;
}
