import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ example: 'doctor@vitalpathia.com', format: 'email' })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password1', minLength: 6, maxLength: 12 })
  @IsString()
  @MinLength(6)
  @MaxLength(12)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,12}$/, {
    message:
      'La contraseña debe tener una mayúscula, una minúscula y un número',
  })
  password: string;
}
