import * as z from 'zod';

export const recoverPasswordSchema = z.object({
  email: z
    .string()
    .nonempty('El email es obligatorio')
    .email('Introduce un email válido'),
});

export type RecoverPasswordFormValues = z.infer<typeof recoverPasswordSchema>;
