import { Controller, Get, ForbiddenException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SeedService } from './seed.service';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  @ApiOperation({
    summary: 'Poblar la base de datos con datos de prueba',
    description:
      'Elimina todos los datos existentes y crea usuarios de todos los tipos. Solo disponible fuera de producción.',
  })
  @ApiResponse({ status: 200, description: 'Seed ejecutado correctamente' })
  @ApiResponse({ status: 403, description: 'No disponible en producción' })
  runSeed() {
    if (process.env.NODE_ENV === 'production') {
      throw new ForbiddenException('Seed no disponible en producción');
    }

    return this.seedService.runSeed();
  }
}
