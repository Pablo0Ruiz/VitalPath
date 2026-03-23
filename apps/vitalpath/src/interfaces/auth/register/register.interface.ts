import * as z from 'zod';

export const registerSchema = z.object({
  name: z.string().nonempty('El nombre es obligatorio'),
  lastName: z.string().nonempty('El apellido es obligatorio'),
  email: z
    .string()
    .nonempty('El email es obligatorio')
    .email('Introduce un email válido'),
  password: z
    .string()
    .nonempty('La contraseña es obligatoria')
    .min(6, 'Mínimo 6 caracteres'),
  fechaNacimiento: z.string().nonempty('La fecha de nacimiento es obligatoria'),
  genero: z.enum(['Masculino', 'Femenino', 'Otro']),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
