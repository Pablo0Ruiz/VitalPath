import { IsMongoId, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateAppointmentDto } from './create-appointment.dto';

export class CreateAppointmentWorkerDto extends CreateAppointmentDto {
  @ApiProperty({
    example: '664e2b3f8d1a2c0012345678',
    description: 'MongoDB ObjectId of the patient',
  })
  @IsNotEmpty({ message: 'El ID del paciente es requerido' })
  @IsMongoId({ message: 'El ID del paciente debe ser un MongoId válido' })
  paciente_ID: string;
}
