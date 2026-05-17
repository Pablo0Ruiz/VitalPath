import {
  IsEmail,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserGenero } from '../enum/user-genero.enum';

export class RegisterPatientByWorkerDto {
  @ApiProperty({ example: 'Juan' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({ example: 'Pérez' })
  @IsString()
  @MinLength(3)
  lastName: string;

  @ApiProperty({ example: 'juan.perez@example.com', format: 'email' })
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

  @ApiProperty({
    example: '15/06/1990',
    description: 'Birth date in DD/MM/YYYY format',
    type: String,
  })
  @IsString()
  fechaNacimiento: string;

  @ApiProperty({ enum: UserGenero, example: UserGenero.MASCULINO })
  @IsEnum(UserGenero)
  genero: UserGenero;

  @ApiPropertyOptional({ example: '664e2b3f8d1a2c0012345678' })
  @IsOptional()
  @IsMongoId()
  centroSalud_ID?: string;
}
