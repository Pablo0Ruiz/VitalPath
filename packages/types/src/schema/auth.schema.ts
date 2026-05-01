import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es obligatorio')
    .email('Introduce un email válido'),
  password: z
    .string()
    .min(1, 'La contraseña es obligatoria')
    .min(6, 'Mínimo 6 caracteres'),
});

export type LoginSchemaValues = z.infer<typeof loginSchema>;
export type LoginFormValues = LoginSchemaValues;

export const recoverPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es obligatorio')
    .email('Introduce un email válido'),
});
export type RecoverPasswordFormValues = z.infer<typeof recoverPasswordSchema>;

export const step1Schema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  lastName: z.string().min(1, 'El apellido es obligatorio'),
});
export type Step1FormValues = z.infer<typeof step1Schema>;

export const step2Schema = z.object({
  fechaNacimiento: z
    .string()
    .min(1, 'La fecha de nacimiento es obligatoria')
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Formato inválido (DD/MM/AAAA)'),
  genero: z.enum(['Masculino', 'Femenino', 'Otro']),
});
export type Step2FormValues = z.infer<typeof step2Schema>;

export const step3Schema = z.object({
  email: z
    .string()
    .min(1, 'El email es obligatorio')
    .email('Introduce un email válido'),
  password: z
    .string()
    .min(1, 'La contraseña es obligatoria')
    .min(6, 'Mínimo 6 caracteres'),
});
export type Step3FormValues = z.infer<typeof step3Schema>;

export const registerSchema = step1Schema.and(step2Schema).and(step3Schema);
export type RegisterFormValues = z.infer<typeof registerSchema>;

export const inviteSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es obligatorio')
    .email('Introduce un email válido'),
  role: z.enum(['medico', 'trabajador_centro', 'admin']),
  codigoVerificacion: z.string().min(1, 'El codigo es obligatorio'),
});
export type InviteFormValues = z.infer<typeof inviteSchema>;

export type InviteDoctorDto = {
  email: string;
  role: string;
  codigoVerificacion: string;
};

export const codigoSchema = z.object({
  codigo: z
    .string()
    .length(6, 'El código debe tener 6 dígitos')
    .regex(/^\d{6}$/, 'Solo dígitos numéricos'),
});
export type CodigoFormValues = z.infer<typeof codigoSchema>;
