import { ArrayMaxSize, IsArray, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDoctorScheduleDto {
  @ApiProperty({
    type: [String],
    example: ['09:00', '10:00', '14:30'],
    description: 'Full-replace list of availability slots in HH:MM format',
  })
  @IsArray()
  @ArrayMaxSize(48)
  @IsString({ each: true })
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    each: true,
    message: 'Cada slot debe ser HH:mm (00:00-23:59)',
  })
  slots: string[];
}
