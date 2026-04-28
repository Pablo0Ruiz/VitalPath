import { Injectable } from '@nestjs/common';
import type { ToolSet } from 'ai';
import { AppointmentService } from 'src/appointment/appointment.service';
import { HospitalsService } from 'src/hospitals/hospitals.service';
import { buildAppointmentTools, buildMedicosTools } from './tools';

@Injectable()
export class GroqToolsService {
  constructor(
    private readonly hospitalsService: HospitalsService,
    private readonly appointmentsService: AppointmentService,
  ) {}

  getToolsFor(userId: string): ToolSet {
    return {
      ...buildAppointmentTools(this.appointmentsService, userId),
      ...buildMedicosTools(this.hospitalsService),
    };
  }
}
