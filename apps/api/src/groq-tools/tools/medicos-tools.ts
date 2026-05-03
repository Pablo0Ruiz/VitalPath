import { tool, type ToolSet } from 'ai';
import { z } from 'zod';
import { HospitalsService } from 'src/hospitals/hospitals.service';

export const buildMedicosTools = (
  hospitalsService: HospitalsService,
): ToolSet => {
  return {
    getDoctors: tool({
      description:
        'Obtiene la lista de todos los médicos disponibles en el sistema. NO requiere parámetros de entrada.',
      inputSchema: z.preprocess(val => val ?? {}, z.object({})),
      execute: async () => {
        const result = await hospitalsService.getDoctors();
        return JSON.parse(JSON.stringify(result));
      },
    }),

    getCentrosSalud: tool({
      description:
        'Obtiene la lista de todos los centros de salud disponibles. NO requiere parámetros de entrada.',
      inputSchema: z.preprocess(val => val ?? {}, z.object({})),
      execute: async () => {
        const result = await hospitalsService.getCentrosSalud();
        return JSON.parse(JSON.stringify(result));
      },
    }),
  };
};
