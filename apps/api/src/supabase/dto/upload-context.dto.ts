import { IsMongoId, IsOptional } from 'class-validator';

export class UploadContextDto {
  @IsOptional()
  @IsMongoId({ message: 'paciente_ID debe ser un MongoId válido' })
  paciente_ID?: string;

  @IsOptional()
  @IsMongoId({ message: 'cita_ID debe ser un MongoId válido' })
  cita_ID?: string;
}
