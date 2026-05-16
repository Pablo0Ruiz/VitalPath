import { IsMongoId, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadContextDto {
  @ApiProperty({
    description: 'Mongo ObjectId of the patient',
    required: false,
  })
  @IsOptional()
  @IsMongoId({ message: 'paciente_ID debe ser un MongoId válido' })
  paciente_ID?: string;

  @ApiProperty({
    description: 'Mongo ObjectId of the appointment',
    required: false,
  })
  @IsOptional()
  @IsMongoId({ message: 'cita_ID debe ser un MongoId válido' })
  cita_ID?: string;
}
