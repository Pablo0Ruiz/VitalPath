import {
  IsDate,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @MinLength(3)
  lastName: string;

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

  @IsString()
  @IsOptional()
  role: string;

  @IsDate()
  fechaNacimiento: Date;

  @IsString()
  @IsOptional()
  centroSalud_ID: string;

  @IsString()
  @IsOptional()
  genero: string;
}
