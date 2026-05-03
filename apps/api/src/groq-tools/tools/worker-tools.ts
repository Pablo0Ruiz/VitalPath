import { tool, type ToolSet } from 'ai';
import { z } from 'zod';
import { AppointmentService } from 'src/appointment/appointment.service';
import { CitaState } from 'src/appointment/dto/enum/cita-state.enum';

export const buildWorkerTools = (
  appointmentsService: AppointmentService,
): ToolSet => {
  return {
    getAllCitas: tool({
      description:
        'Lista todas las citas de todos los pacientes del centro médico.',
      inputSchema: z.object({}),
      execute: async () => {
        const result = await appointmentsService.getAppointmentsAdministrator();
        return JSON.parse(JSON.stringify(result));
      },
    }),

    actualizarEstadoCita: tool({
      description:
        'Avanza el estado de una cita de forma secuencial: AGENDADA → ASISTIDA → EN_PROCESO → RESULTADOS_LISTOS → COMPLETADA.',
      inputSchema: z.object({
        citaId: z.string().describe('ID de la cita a actualizar.'),
        estado: z
          .nativeEnum(CitaState)
          .describe('Nuevo estado al que avanzar la cita.'),
      }),
      execute: async ({ citaId, estado }) => {
        const result = await appointmentsService.updateEstadoWorker(
          citaId,
          estado,
        );
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
