import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InviteDoctorDto {
  @ApiProperty({ example: 'doctor@vitalpathia.com', format: 'email' })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'medico' })
  @IsString()
  role: string;
}
