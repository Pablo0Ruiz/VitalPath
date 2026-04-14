import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { CitaState } from 'src/appointment/dto/enum/cita-state.enum';
import { CreateAppointmentDto } from './create-appointment.dto';

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
  @IsOptional()
  @IsEnum(CitaState, { message: 'Estado inválido' })
  estado?: CitaState;
}
