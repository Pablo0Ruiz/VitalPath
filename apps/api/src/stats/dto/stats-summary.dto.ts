import { ApiProperty } from '@nestjs/swagger';

export class StatsSummaryDto {
  @ApiProperty({
    example: 143,
    description: 'Total number of registered patients',
  })
  totalPatients: number;

  @ApiProperty({
    example: 8,
    description: 'Total number of registered doctors',
  })
  totalDoctors: number;

  @ApiProperty({
    description:
      'Appointment count grouped by CitaState. Missing states default to 0.',
    example: {
      agendada: 31,
      asistida: 12,
      en_proceso: 4,
      resultados_listos: 2,
      completada: 88,
      cancelada: 6,
    },
  })
  appointmentsByState: Record<string, number>;

  @ApiProperty({ example: 27, description: 'Total number of mood check-ins' })
  totalMoods: number;
}
