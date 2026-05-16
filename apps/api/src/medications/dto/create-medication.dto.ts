import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMedicationDto {
  @ApiProperty({ description: 'Medication name', example: 'Ibuprofeno' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Medication description or dosage instructions',
    example: '400mg cada 8h',
    required: false,
  })
  @IsString()
  @IsOptional()
  description: string;
}
