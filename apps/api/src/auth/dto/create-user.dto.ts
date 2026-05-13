import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Juan' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({ example: 'Pérez' })
  @IsString()
  @MinLength(3)
  lastName: string;

  @ApiProperty({ example: 'juan.perez@vitalpathia.com', format: 'email' })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password1', minLength: 6, maxLength: 50 })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,50}$/, {
    message:
      'La contraseña debe tener una mayúscula, una minúscula y un número',
  })
  password: string;

  @ApiPropertyOptional({ example: 'paciente' })
  @IsString()
  @IsOptional()
  role: string;

  @ApiProperty({ example: '1990-06-15', type: String, format: 'date' })
  @IsDate()
  fechaNacimiento: Date;

  @ApiPropertyOptional({ example: '664e2b3f8d1a2c0012345678' })
  @IsString()
  @IsOptional()
  centroSalud_ID: string;

  @ApiPropertyOptional({ example: 'masculino' })
  @IsString()
  @IsOptional()
  genero: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  seniorMode?: boolean;
}
