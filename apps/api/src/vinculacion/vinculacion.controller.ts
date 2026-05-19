import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { UserRoles } from 'src/auth/enum/user-role.enum';
import { VinculacionService } from './vinculacion.service';
import { VincularDto } from './dto/vincular.dto';

@ApiTags('vinculacion')
@ApiBearerAuth('access-token')
@Controller('vinculacion')
export class VinculacionController {
  constructor(private readonly vinculacionService: VinculacionService) {}

  @Auth(UserRoles.PACIENTE)
  @Post('generar-codigo')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Patient generates a 6-digit pairing code (TTL: 15 min)',
  })
  @ApiResponse({ status: 201, description: 'Code generated' })
  @ApiResponse({ status: 403, description: 'Forbidden — PACIENTE only' })
  generarCodigo(@GetUser('_id') pacienteId: string) {
    return this.vinculacionService.generarCodigo(pacienteId);
  }

  @Auth(UserRoles.CUIDADOR_FAMILIAR)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('vincular')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cuidador redeems a pairing code to link with a patient',
  })
  @ApiResponse({ status: 200, description: 'Vinculacion activated' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden — CUIDADOR_FAMILIAR only',
  })
  @ApiResponse({ status: 404, description: 'Code not found' })
  @ApiResponse({
    status: 409,
    description: 'Code already used or already linked',
  })
  @ApiResponse({ status: 410, description: 'Code expired' })
  vincular(
    @GetUser('_id') cuidadorId: string,
    @Body() vincularDto: VincularDto,
  ) {
    return this.vinculacionService.vincular(cuidadorId, vincularDto);
  }

  @Auth(UserRoles.PACIENTE)
  @Patch(':id/revocar')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Patient revokes a cuidador link' })
  @ApiResponse({ status: 200, description: 'Vinculacion revoked' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden — must own the vinculacion',
  })
  @ApiResponse({ status: 404, description: 'Vinculacion not found' })
  revocar(
    @GetUser('_id') pacienteId: string,
    @Param('id') vinculacionId: string,
  ) {
    return this.vinculacionService.revocar(pacienteId, vinculacionId);
  }

  @Auth(UserRoles.CUIDADOR_FAMILIAR)
  @Get('mis-pacientes')
  @ApiOperation({ summary: 'Cuidador lists their ACTIVO linked patients' })
  @ApiResponse({ status: 200, description: 'List of linked patients' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden — CUIDADOR_FAMILIAR only',
  })
  listarMisPacientes(@GetUser('_id') cuidadorId: string) {
    return this.vinculacionService.listarMisPacientes(cuidadorId);
  }

  @Auth(UserRoles.PACIENTE)
  @Get('mis-cuidadores')
  @ApiOperation({ summary: 'Patient lists all their cuidadores (any estado)' })
  @ApiResponse({ status: 200, description: 'List of cuidadores' })
  @ApiResponse({ status: 403, description: 'Forbidden — PACIENTE only' })
  listarMisCuidadores(@GetUser('_id') pacienteId: string) {
    return this.vinculacionService.listarMisCuidadores(pacienteId);
  }
}
