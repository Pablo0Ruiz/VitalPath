'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Mail01Icon,
  LockPasswordIcon,
  UserIcon,
  ViewIcon,
  ViewOffSlashIcon,
  Calendar03Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Card } from '@/components/ui/atoms/Card';
import { Button } from '@/components/ui/atoms/Button';
import { Input } from '@/components/ui/atoms/Input';
import { Select } from '@/components/ui/atoms/Select';
import { FormField } from '@/components/ui/molecules/FormField';
import { useRegisterPatientByWorker } from '@repo/api-client';
import type { CreatedPatientResponse } from '@repo/api-client';
import {
  registerPatientSchema,
  type RegisterPatientFormData,
} from '@repo/types';

const generoOptions = [
  { value: 'Masculino', label: 'Masculino' },
  { value: 'Femenino', label: 'Femenino' },
  { value: 'Otro', label: 'Otro' },
];

interface RegisterPatientFormProps {
  onSuccess: (patient: CreatedPatientResponse) => void;
}

const RegisterPatientForm = ({ onSuccess }: RegisterPatientFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterPatientFormData>({
    resolver: zodResolver(registerPatientSchema),
  });

  const { mutate, isPending } = useRegisterPatientByWorker({
    onSuccess: patient => {
      setServerError(null);
      onSuccess(patient);
    },
    onError: (error: unknown) => {
      const err = error as {
        response?: { status?: number; data?: { message?: string } };
      };
      if (err?.response?.status === 409) {
        setError('email', {
          type: 'server',
          message: 'Este email ya está registrado',
        });
      } else {
        setServerError(
          'Ocurrió un error al registrar el paciente. Intentá de nuevo.',
        );
      }
    },
  });

  const onSubmit = (data: RegisterPatientFormData) => {
    setServerError(null);
    mutate(data);
  };

  return (
    <Card padding="none" className="w-full max-w-2xl overflow-hidden">
      <div className="px-8 py-6 border-b border-brand-border">
        <h2 className="text-lg font-semibold text-brand-text-primary">
          Registrar nuevo paciente
        </h2>
        <p className="text-sm text-brand-text-secondary mt-1">
          Completá los datos del paciente para crear su perfil.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-8 flex flex-col gap-5"
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Nombre" error={errors.name?.message}>
            <Input
              type="text"
              placeholder="Juan"
              leftIcon={UserIcon}
              {...register('name')}
            />
          </FormField>

          <FormField label="Apellido" error={errors.lastName?.message}>
            <Input
              type="text"
              placeholder="García"
              leftIcon={UserIcon}
              {...register('lastName')}
            />
          </FormField>
        </div>

        <FormField label="Correo electrónico" error={errors.email?.message}>
          <Input
            type="email"
            placeholder="paciente@ejemplo.com"
            leftIcon={Mail01Icon}
            {...register('email')}
          />
        </FormField>

        <FormField label="Contraseña" error={errors.password?.message}>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              leftIcon={LockPasswordIcon}
              rightIcon={showPassword ? ViewOffSlashIcon : ViewIcon}
              className="pr-10"
              {...register('password')}
            />
            <Button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              variant="ghost"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-neutral-400 hover:text-brand-text-primary transition-colors"
            >
              <HugeiconsIcon
                icon={showPassword ? ViewOffSlashIcon : ViewIcon}
                size={16}
              />
            </Button>
          </div>
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Fecha de nacimiento"
            error={errors.fechaNacimiento?.message}
            hint="Formato DD/MM/AAAA"
          >
            <Input
              type="text"
              placeholder="15/08/1990"
              leftIcon={Calendar03Icon}
              maxLength={10}
              {...register('fechaNacimiento')}
            />
          </FormField>

          <FormField label="Género" error={errors.genero?.message}>
            <Select
              options={generoOptions}
              placeholder="Seleccioná el género"
              {...register('genero')}
            />
          </FormField>
        </div>

        {serverError && (
          <p className="text-sm text-brand-state-error text-center">
            {serverError}
          </p>
        )}

        <Button
          variant="primary"
          size="lg"
          fullWidth
          type="submit"
          loading={isPending}
        >
          Registrar paciente
        </Button>
      </form>
    </Card>
  );
};

export default RegisterPatientForm;
