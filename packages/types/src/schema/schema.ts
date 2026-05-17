import { z } from 'zod';

export const registerPatientSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  lastName: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  fechaNacimiento: z
    .string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Formato DD/MM/AAAA'),
  genero: z.enum(['Masculino', 'Femenino', 'Otro']),
});

export type RegisterPatientFormData = z.infer<typeof registerPatientSchema>;
