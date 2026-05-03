import { tool, type ToolSet } from 'ai';
import { z } from 'zod';
import { UserService } from 'src/user/user.service';

export const buildPatientDataTools = (
  userService: UserService,
  userId: string,
): ToolSet => {
  return {
    getMisEstudios: tool({
      description:
        'Obtiene los estudios médicos y sus resúmenes del paciente actual.',
      inputSchema: z.object({}),
      execute: async () => {
        const profile = await userService.getUserProfile(userId);
        return JSON.parse(
          JSON.stringify(profile.profile?.resultadosEstudio ?? []),
        );
      },
    }),
  };
};
