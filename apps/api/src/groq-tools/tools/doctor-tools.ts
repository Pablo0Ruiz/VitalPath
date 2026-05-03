import { tool, type ToolSet } from 'ai';
import { z } from 'zod';
import { AppointmentService } from 'src/appointment/appointment.service';

export const buildDoctorTools = (
  appointmentsService: AppointmentService,
  userId: string,
): ToolSet => {
  return {
    getMisCitas: tool({
      description: 'Lista todas las citas médicas asignadas al médico actual.',
      inputSchema: z.object({}),
      execute: async () => {
        const result = await appointmentsService.getAppointmentsMedico(userId);
        return JSON.parse(JSON.stringify(result));
      },
    }),

    getPacienteData: tool({
      description:
        'Obtiene los datos básicos del paciente asociado a una cita específica.',
      inputSchema: z.object({
        citaId: z.string().describe('ID de la cita del paciente.'),
      }),
      execute: async ({ citaId }) => {
        const result =
          await appointmentsService.getAppointmentByIdForStaff(citaId);
        return JSON.parse(JSON.stringify(result));
      },
    }),
  };
};
