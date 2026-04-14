import { IsDateString, IsNotEmpty, IsMongoId } from 'class-validator';

export class CreateAppointmentDto {
  @IsNotEmpty({ message: 'La fecha y hora son requeridas' })
  @IsDateString({}, { message: 'Formato de fecha inválido. Use ISO 8601.' })
  fechaHora: string;

  @IsNotEmpty({ message: 'El ID del médico es requerido' })
  @IsMongoId({ message: 'El ID del médico debe ser un MongoId válido' })
  medico_ID: string;

  @IsNotEmpty({ message: 'El ID del centro de salud es requerido' })
  @IsMongoId({
    message: 'El ID del centro de salud debe ser un MongoId válido',
  })
  centroSalud_ID: string;
}
