import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({
    example: '2026-06-15',
    description: 'Appointment date in YYYY-MM-DD format',
  })
  @IsNotEmpty({ message: 'La fecha es requerida' })
  @IsString({ message: 'La fecha debe ser un string YYYY-MM-DD' })
  fecha: string;

  @ApiProperty({
    example: '09:00',
    description: 'Appointment time in HH:mm format',
  })
  @IsNotEmpty({ message: 'La hora es requerida' })
  @IsString({ message: 'La hora debe ser un string HH:mm' })
  hora: string;

  @ApiProperty({
    example: '664e2b3f8d1a2c0012345678',
    description: 'MongoDB ObjectId of the doctor',
  })
  @IsNotEmpty({ message: 'El ID del médico es requerido' })
  @IsMongoId({ message: 'El ID del médico debe ser un MongoId válido' })
  medico_ID: string;

  @ApiProperty({
    example: '664e2b3f8d1a2c0087654321',
    description: 'MongoDB ObjectId of the health center',
  })
  @IsNotEmpty({ message: 'El ID del centro de salud es requerido' })
  @IsMongoId({
    message: 'El ID del centro de salud debe ser un MongoId válido',
  })
  centroSalud_ID: string;
}
