import { IsIn, IsISO8601, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMoodDto {
  @ApiProperty({
    description: 'Mood rating from 1 (worst) to 5 (best)',
    enum: ['1', '2', '3', '4', '5'],
    example: '4',
  })
  @IsString()
  @IsIn(['1', '2', '3', '4', '5'])
  mood: string;

  @ApiProperty({
    description: 'Date of the mood entry (ISO 8601)',
    example: '2024-05-13T00:00:00.000Z',
  })
  @IsISO8601()
  date: string;
}
