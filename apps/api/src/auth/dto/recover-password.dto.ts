import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RecoverPasswordDto {
  @ApiProperty({ example: 'usuario@vitalpathia.com', format: 'email' })
  @IsString()
  @IsEmail()
  email: string;
}
