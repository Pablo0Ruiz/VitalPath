import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { Especialidad } from '../enum/especialidad.enum';

export class RegisterDto extends CreateUserDto {
  @IsEnum(Especialidad)
  @IsOptional()
  especialidad?: Especialidad;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  slots?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  medications?: string[];
}
