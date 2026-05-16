import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { Especialidad } from '../enum/especialidad.enum';

export class RegisterDto extends CreateUserDto {
  @ApiPropertyOptional({
    enum: Especialidad,
    example: Especialidad.MEDICINA_GENERAL,
  })
  @IsEnum(Especialidad)
  @IsOptional()
  especialidad?: Especialidad;

  @ApiPropertyOptional({ type: [String], example: ['09:00', '10:00'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  slots?: string[];

  @ApiPropertyOptional({
    type: [String],
    example: ['664e2b3f8d1a2c0012345678'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  medications?: string[];
}
