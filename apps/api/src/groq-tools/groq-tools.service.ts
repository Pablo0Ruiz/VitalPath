import { Injectable } from '@nestjs/common';
import type { ToolSet } from 'ai';
import { AppointmentService } from 'src/appointment/appointment.service';
import { HospitalsService } from 'src/hospitals/hospitals.service';
import { UserService } from 'src/user/user.service';
import { UserRoles } from 'src/auth/enum/user-role.enum';
import {
  buildAppointmentTools,
  buildMedicosTools,
  buildPatientDataTools,
  buildDoctorTools,
  buildWorkerTools,
} from './tools';

@Injectable()
export class GroqToolsService {
  constructor(
    private readonly hospitalsService: HospitalsService,
    private readonly appointmentsService: AppointmentService,
    private readonly userService: UserService,
  ) {}

  getToolsFor(userId: string, role: UserRoles): ToolSet {
    switch (role) {
      case UserRoles.PACIENTE:
        return {
          ...buildAppointmentTools(this.appointmentsService, userId),
          ...buildMedicosTools(this.hospitalsService),
          ...buildPatientDataTools(this.userService, userId),
        };
      case UserRoles.MEDICO:
        return {
          ...buildDoctorTools(this.appointmentsService, userId),
          ...buildMedicosTools(this.hospitalsService),
        };
      case UserRoles.TRABAJADOR_CENTRO:
        return buildWorkerTools(this.appointmentsService);
      default:
        return {};
    }
  }
}
