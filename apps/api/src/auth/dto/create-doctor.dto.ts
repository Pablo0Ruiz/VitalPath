import { IsEnum } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { Especialidad } from '../enum/especialidad.enum';

export class CreateDoctorDto extends CreateUserDto {
  @IsEnum(Especialidad)
  especialidad: Especialidad;
}
