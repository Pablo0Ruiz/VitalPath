import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { Especialidad } from '../enum/especialidad.enum';

export class CreateDoctorDto extends CreateUserDto {
  @IsEnum(Especialidad)
  especialidad: Especialidad;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  slots?: string[];
}
