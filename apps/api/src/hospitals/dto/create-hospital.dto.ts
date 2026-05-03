import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { HospitalType } from '../../user/entities/centro-salud.entity';

export class CreateHospitalDto {
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString()
  nombre: string;

  @IsNotEmpty({ message: 'La dirección es requerida' })
  @IsString()
  direccion: string;

  @IsOptional()
  @IsEnum(HospitalType)
  tipo?: HospitalType;

  @IsOptional()
  @IsString()
  codigoVinculacion?: string;
}
