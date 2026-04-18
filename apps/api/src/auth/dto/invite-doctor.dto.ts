import { IsEmail, IsString } from 'class-validator';

export class InviteDoctorDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  role: string;
}
