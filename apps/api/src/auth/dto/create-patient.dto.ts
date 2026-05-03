import { IsArray, IsOptional, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class CreatePatientDto extends CreateUserDto {
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  medications?: string[];
}
