import { tool, type ToolSet } from 'ai';
import { z } from 'zod';
import { AppointmentService } from 'src/appointment/appointment.service';
import type {
  CreateAppointmentDto,
  UpdateAppointmentDto,
} from 'src/appointment/dto';
import { CitaState } from 'src/appointment/dto/enum/cita-state.enum';

export const buildAppointmentTools = (
  appointmentsService: AppointmentService,
  userId: string,
): ToolSet => {
  const createAppointmentSchema = z.object({
    medico_ID: z.string().describe('ID del médico solicitado.'),
    centroSalud_ID: z.string().describe('ID del centro de salud.'),
    fecha: z.string().describe('Fecha en formato YYYY-MM-DD (ej: 2026-05-10).'),
    hora: z.string().describe('Hora en formato HH:mm (ej: 14:30).'),
  });

  const getAppointmentByIdSchema = z.object({
    citaId: z.string().describe('El ID único de la cita.'),
  });

  const updateAppointmentSchema = z.object({
    citaId: z.string().describe('ID de la cita a modificar.'),
    medico_ID: z.string().optional(),
    centroSalud_ID: z.string().optional(),
    fecha: z.string().optional(),
    hora: z.string().optional(),
    estado: z.nativeEnum(CitaState).optional(),
  });

  const cancelAppointmentSchema = z.object({
    citaId: z.string().describe('ID de la cita a cancelar.'),
  });

  return {
    createAppointment: tool({
      description:
        'Agenda una nueva cita médica. El paciente es el usuario autenticado.',
      inputSchema: createAppointmentSchema,
      execute: async (args: z.infer<typeof createAppointmentSchema>) => {
        const result = await appointmentsService.createAppointment(
          userId,
          args as CreateAppointmentDto,
        );
        return JSON.parse(JSON.stringify(result));
      },
    }),

    getAppointments: tool({
      description:
        'Lista todas las citas del paciente actual. NO requiere parámetros de entrada.',
      inputSchema: z.preprocess(val => val ?? {}, z.object({})),
      execute: async () => {
        console.log(
          `[Tools] Llamando a getAppointments para userId: ${userId}`,
        );
        const result = await appointmentsService.getAppointments(userId);
        console.log(
          `[Tools] Resultado de getAppointments: ${result.length} citas encontradas.`,
        );
        return JSON.parse(JSON.stringify(result));
      },
    }),

    getAppointmentById: tool({
      description: 'Obtiene los detalles de una cita específica por su ID.',
      inputSchema: getAppointmentByIdSchema,
      execute: async ({ citaId }: z.infer<typeof getAppointmentByIdSchema>) => {
        const result = await appointmentsService.getAppointmentById(
          userId,
          citaId,
        );
        return JSON.parse(JSON.stringify(result));
      },
    }),

    updateAppointment: tool({
      description: 'Actualiza los datos de una cita existente.',
      inputSchema: updateAppointmentSchema,
      execute: async ({
        citaId,
        ...updateDto
      }: z.infer<typeof updateAppointmentSchema>) => {
        const result = await appointmentsService.updateAppointment(
          userId,
          citaId,
          updateDto as UpdateAppointmentDto,
        );
        return JSON.parse(JSON.stringify(result));
      },
    }),

    cancelAppointment: tool({
      description: 'Cancela una cita médica específica.',
      inputSchema: cancelAppointmentSchema,
      execute: async ({ citaId }: z.infer<typeof cancelAppointmentSchema>) => {
        const result = await appointmentsService.cancelAppointment(
          userId,
          citaId,
        );
        return JSON.parse(JSON.stringify(result));
      },
    }),
  };
};
