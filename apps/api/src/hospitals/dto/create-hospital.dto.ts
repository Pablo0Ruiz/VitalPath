import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateHospitalDto {
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString()
  nombre: string;

  @IsNotEmpty({ message: 'La dirección es requerida' })
  @IsString()
  direccion: string;

  @IsOptional()
  @IsString()
  codigoVinculacion?: string;
}
