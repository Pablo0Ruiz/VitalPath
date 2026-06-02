import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsIn,
  IsInt,
  Min,
  IsArray,
  Matches,
} from 'class-validator';
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

  @ApiProperty({
    description: 'Start time in HH:mm format',
    example: '08:00',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{2}:\d{2}$/, {
    message: 'startTime must be in HH:mm format',
  })
  startTime?: string;

  @ApiProperty({
    description: 'Frequency in hours. Must be one of: 4, 6, 8, 12, 24',
    example: 8,
    required: false,
  })
  @IsOptional()
  @IsIn([4, 6, 8, 12, 24], {
    message: 'frequencyHours must be one of: 4, 6, 8, 12, 24',
  })
  frequencyHours?: number;

  @ApiProperty({
    description:
      'Duration in days (positive integer). Omit for indefinite course.',
    example: 7,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  durationDays?: number;

  @ApiProperty({
    description: 'Expo notification IDs for scheduled reminders',
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  notificationIds?: string[];
}
