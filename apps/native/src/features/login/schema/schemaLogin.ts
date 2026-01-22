import { z } from 'zod';

export const schema = z.object({
  email: z.email('El correo es requerido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

export type FormData = z.infer<typeof schema>;
