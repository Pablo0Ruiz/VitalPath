'use client';

import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Mail01Icon,
  LockPasswordIcon,
  ViewIcon,
  ViewOffSlashIcon,
  Hospital01Icon,
} from '@hugeicons/core-free-icons';
import { Card, Button, Input, Select } from '@/components/ui/atoms';
import { FormField } from '@/components/ui/molecules/FormField';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { inviteSchema, loginSchema, type LoginSchemaValues } from '@repo/types';
import { useMutation } from '@tanstack/react-query';
import {
  postLogin,
  ACCESS_TOKEN_KEY,
  postInviteVerification,
} from '@repo/api-client';
import type { InviteFormValues, UserCredentials } from '@repo/types';
import HeaderLogin from '../../atoms/HeaderLogin/HeaderLogin';

const roleOptions = [
  { value: 'medico', label: 'Médico' },
  { value: 'trabajador_centro', label: 'Personal del centro' },
  { value: 'admin', label: 'Administrador' },
];

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showLinkForm, setShowLinkForm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaValues>({
    resolver: zodResolver(loginSchema),
  });
  const {
    register: registerInvite,
    handleSubmit: handleSubmitInvite,
    formState: { errors: errorsInvite },
  } = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      role: 'medico',
    },
  });

  const {
    mutate,
    isPending,
    error: loginError,
  } = useMutation<UserCredentials, Error, LoginSchemaValues>({
    mutationFn: postLogin,
    onSuccess: data => {
      document.cookie = `${ACCESS_TOKEN_KEY}=${encodeURIComponent(data.accessToken)}; path=/; SameSite=Lax`;
      window.location.href = '/dashboard';
    },
    onError: err => {
      console.error('Error al iniciar sesión:', err);
    },
  });
  const {
    mutate: inviteMutate,
    isPending: inviteIsPending,
    error: inviteError,
  } = useMutation<UserCredentials, Error, InviteFormValues>({
    mutationFn: postInviteVerification,
    onSuccess: data => {
      document.cookie = `${ACCESS_TOKEN_KEY}=${encodeURIComponent(data.accessToken)}; path=/; SameSite=Lax`;
      window.location.href = '/dashboard';
    },
    onError: err => {
      console.error('Error al iniciar sesión:', err);
    },
  });

  const onSubmit = (data: LoginSchemaValues) => {
    mutate(data);
  };

  const onSubmitInvite = (
    data: InviteFormValues,
    e?: React.BaseSyntheticEvent,
  ) => {
    e?.preventDefault();
    e?.stopPropagation();
    inviteMutate(data);
  };

  return (
    <Card padding="none" className="w-full max-w-md overflow-hidden">
      <div className="p-8 flex flex-col gap-6">
        <HeaderLogin />
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField label="Correo electrónico" error={errors.email?.message}>
            <Input
              type="email"
              placeholder="doctor@vitalpathia.com"
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
                className="pr-10"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={showLinkForm || isPending}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-neutral-400 hover:text-brand-text-primary transition-colors"
              >
                <HugeiconsIcon
                  icon={showPassword ? ViewOffSlashIcon : ViewIcon}
                  size={16}
                />
              </button>
            </div>
          </FormField>

          <div className="flex justify-end">
            <a
              href="#"
              className="text-sm text-brand-primary-600 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            type="submit"
            loading={isPending}
          >
            Ingresar
          </Button>

          {loginError && (
            <p className="text-sm text-brand-error-500 text-center">
              Error al iniciar sesión. Verificá tus credenciales.
            </p>
          )}
        </form>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-brand-border" />
          <span className="text-xs text-brand-text-secondary">
            ¿Primera vez?
          </span>
          <div className="flex-1 h-px bg-brand-border" />
        </div>

        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={() => setShowLinkForm(!showLinkForm)}
            className="text-sm text-brand-primary-600 hover:underline text-center"
          >
            Vinculá tu perfil con el código de tu centro
          </button>

          {showLinkForm && (
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSubmitInvite(onSubmitInvite)(e);
              }}
              className="flex flex-col gap-4 p-4 bg-brand-neutral-50 rounded-xl border border-brand-border"
            >
              <div className="grid grid-cols-2 gap-3">
                <FormField label="email" error={errorsInvite.email?.message}>
                  <Input
                    type="email"
                    placeholder="example@example.com"
                    {...registerInvite('email')}
                  />
                </FormField>
              </div>

              <FormField label="Rol" error={errorsInvite.role?.message}>
                <Select
                  options={roleOptions}
                  placeholder="Seleccioná tu rol"
                  {...registerInvite('role')}
                />
              </FormField>

              <FormField
                label="Código del centro (4-6 dígitos)"
                error={errorsInvite.codigoVerificacion?.message}
              >
                <Input
                  type="text"
                  placeholder="A4F-29K"
                  leftIcon={Hospital01Icon}
                  maxLength={10}
                  {...registerInvite('codigoVerificacion')}
                />
              </FormField>

              <Button
                loading={inviteIsPending}
                type="submit"
                variant="secondary"
                size="md"
                fullWidth
              >
                Vincular perfil
              </Button>
              {inviteError && (
                <p className="text-sm text-brand-error-500 text-center">
                  Error al vincular perfil. Verificá tus credenciales.
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </Card>
  );
};

export default LoginForm;
