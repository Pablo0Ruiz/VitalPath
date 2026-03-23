import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(12)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,12}$/, {
    message:
      'La contraseña debe tener una mayúscula, una minúscula y un número',
  })
  password: string;
}
