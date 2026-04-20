import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';

export class CreateAppointmentDto {
  @IsNotEmpty({ message: 'La fecha es requerida' })
  @IsString({ message: 'La fecha debe ser un string YYYY-MM-DD' })
  fecha: string;

  @IsNotEmpty({ message: 'La hora es requerida' })
  @IsString({ message: 'La hora debe ser un string HH:mm' })
  hora: string;

  @IsNotEmpty({ message: 'El ID del médico es requerido' })
  @IsMongoId({ message: 'El ID del médico debe ser un MongoId válido' })
  medico_ID: string;

  @IsNotEmpty({ message: 'El ID del centro de salud es requerido' })
  @IsMongoId({
    message: 'El ID del centro de salud debe ser un MongoId válido',
  })
  centroSalud_ID: string;
}
