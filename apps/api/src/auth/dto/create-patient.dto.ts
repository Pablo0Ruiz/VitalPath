import { IsArray, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class CreatePatientDto extends CreateUserDto {
  @ApiPropertyOptional({
    type: [String],
    example: ['664e2b3f8d1a2c0012345678'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  medications?: string[];
}
