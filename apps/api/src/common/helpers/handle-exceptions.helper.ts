import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

export function handleServiceException(error: unknown): never {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code: unknown }).code === 11000
  ) {
    throw new BadRequestException('El email ya está registrado');
  }

  console.error('[ServiceException]', error);
  throw new InternalServerErrorException('Error interno, intenta más tarde');
}
