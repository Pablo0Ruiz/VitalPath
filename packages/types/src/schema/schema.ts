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

export const bookAppointmentSchema = z.object({
  paciente_ID: z.string().min(1, 'El paciente es requerido'),
  medico_ID: z.string().min(1, 'El médico es requerido'),
  fecha: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato YYYY-MM-DD')
    .refine(
      v => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const d = new Date(v + 'T00:00:00');
        return d.getTime() >= today.getTime();
      },
      { message: 'La fecha no puede estar en el pasado' },
    ),
  hora: z.string().regex(/^\d{2}:\d{2}$/, 'Formato HH:MM'),
});

export type BookAppointmentFormData = z.infer<typeof bookAppointmentSchema>;

export const TIPO_VALUES = [
  'HIJO_A',
  'ESPOSO_A',
  'CUIDADOR_CONTRATADO',
  'OTRO',
] as const;

export const vincularSchema = z.object({
  codigo: z
    .string()
    .length(6, 'El código debe tener 6 dígitos')
    .regex(/^\d{6}$/, 'Solo dígitos numéricos'),
  tipo_vinculo: z.enum(TIPO_VALUES),
});
export type VincularFormValues = z.infer<typeof vincularSchema>;
