import * as z from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .nonempty('El email es obligatorio')
    .email('Introduce un email válido'),
  password: z
    .string()
    .nonempty('La contraseña es obligatoria')
    .min(6, 'Mínimo 6 caracteres'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
