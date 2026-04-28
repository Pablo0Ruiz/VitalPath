import { tool, type ToolSet } from 'ai';
import { z } from 'zod';
import { HospitalsService } from 'src/hospitals/hospitals.service';

export const buildMedicosTools = (
  hospitalsService: HospitalsService,
): ToolSet => {
  return {
    getDoctors: tool({
      description: 'Lista todos los médicos disponibles.',
      inputSchema: z.object({}),
      execute: async () => {
        const result = await hospitalsService.getDoctors();
        return JSON.parse(JSON.stringify(result));
      },
    }),

    getCentrosSalud: tool({
      description:
        'Lista todos los centros de salud disponibles para agendar una cita.',
      inputSchema: z.object({}),
      execute: async () => {
        const result = await hospitalsService.getCentrosSalud();
        return JSON.parse(JSON.stringify(result));
      },
    }),
  };
};
