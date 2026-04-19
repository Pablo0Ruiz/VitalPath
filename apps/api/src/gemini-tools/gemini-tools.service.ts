import { Injectable } from '@nestjs/common';

import { AppointmentService } from 'src/appointment/appointment.service';
import {
  CreateAppointmentDto,
  UpdateAppointmentDto,
} from 'src/appointment/dto';
import { HospitalsService } from 'src/hospitals/hospitals.service';

type ToolArgs = Record<string, unknown>;

@Injectable()
export class GeminiToolsService {
  constructor(
    private readonly hospitalsService: HospitalsService,
    private readonly appointmentsService: AppointmentService,
  ) {}

  private readonly appointmentToolNames = new Set([
    'createAppointment',
    'getAppointments',
    'getAppointmentById',
    'updateAppointment',
    'cancelAppointment',
  ]);
  private readonly hospitalToolNames = new Set(['getDoctors']);

  private isAppointmentTool(name: string): boolean {
    return this.appointmentToolNames.has(name);
  }

  async executeTool(name: string, args: ToolArgs, userId: string) {
    if (this.isAppointmentTool(name)) {
      return this.executeAppointmentTool(name, args, userId);
    }

    if (this.isHospitalTool(name)) {
      return this.executeHospitalTool(name, args);
    }

    throw new Error(`Herramienta no reconocida: ${name}`);
  }

  private async executeAppointmentTool(
    name: string,
    args: ToolArgs,
    userId: string,
  ) {
    switch (name) {
      case 'createAppointment':
        return this.appointmentsService.createAppointment(
          userId,
          args as unknown as CreateAppointmentDto,
        );

      case 'getAppointments':
        return this.appointmentsService.getAppointments(userId);

      case 'getAppointmentById':
        return this.appointmentsService.getAppointmentById(
          userId,
          args.citaId as string,
        );

      case 'updateAppointment': {
        const { citaId, ...updateDto } = args;
        return this.appointmentsService.updateAppointment(
          userId,
          citaId as string,
          updateDto as unknown as UpdateAppointmentDto,
        );
      }

      case 'cancelAppointment':
        return this.appointmentsService.cancelAppointment(
          userId,
          args.citaId as string,
        );

      default:
        throw new Error(`Herramienta de citas no reconocida: ${name}`);
    }
  }

  private isHospitalTool(name: string): boolean {
    return this.hospitalToolNames.has(name);
  }

  private async executeHospitalTool(name: string, _args: ToolArgs) {
    switch (name) {
      case 'getDoctors':
        return this.hospitalsService.getDoctors();

      default:
        throw new Error(`Herramienta de hospitales no reconocida: ${name}`);
    }
  }
}
