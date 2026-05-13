import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { HospitalType } from '../../user/entities/centro-salud.entity';

export class CreateHospitalDto {
  @ApiProperty({ description: 'Hospital name', example: 'Hospital General' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString()
  nombre: string;

  @ApiProperty({
    description: 'Hospital address',
    example: 'Av. Corrientes 1234',
  })
  @IsNotEmpty({ message: 'La dirección es requerida' })
  @IsString()
  direccion: string;

  @ApiProperty({
    description: 'Hospital type',
    enum: HospitalType,
    required: false,
  })
  @IsOptional()
  @IsEnum(HospitalType)
  tipo?: HospitalType;

  @ApiProperty({
    description: 'Linking code for doctors/workers to join this hospital',
    required: false,
    example: 'HOSP-2024-XYZ',
  })
  @IsOptional()
  @IsString()
  codigoVinculacion?: string;
}
