import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { Especialidad } from '../enum/especialidad.enum';

export class CreateDoctorDto extends CreateUserDto {
  @ApiProperty({ enum: Especialidad, example: Especialidad.CARDIOLOGIA })
  @IsEnum(Especialidad)
  especialidad: Especialidad;

  @ApiPropertyOptional({ type: [String], example: ['09:00', '10:00'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  slots?: string[];
}
