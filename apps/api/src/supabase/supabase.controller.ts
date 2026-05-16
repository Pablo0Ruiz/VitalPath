import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';

import { SupabaseService } from './supabase.service';
import { UploadContextDto } from './dto/upload-context.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { UserRoles } from 'src/auth/enum/user-role.enum';

@ApiTags('storage')
@ApiBearerAuth('access-token')
@Controller('storage')
export class SupabaseController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Auth(UserRoles.TRABAJADOR_CENTRO, UserRoles.MEDICO)
  @Post('upload-file')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiOperation({
    summary: 'Upload one or more files for a patient appointment',
  })
  @ApiResponse({ status: 201, description: 'Files uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Missing or invalid token' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden — requires trabajador_centro or medico role',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description: 'Files to upload',
        },
        paciente_ID: {
          type: 'string',
          description: 'Mongo ObjectId of the patient',
        },
        cita_ID: {
          type: 'string',
          description: 'Mongo ObjectId of the appointment',
        },
      },
    },
  })
  async uploadFile(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() ctx: UploadContextDto,
  ) {
    const responseFile = await this.supabaseService.uploadFile(files, ctx);
    return { responseFile, message: 'Archivo subido correctamente' };
  }

  @Auth(UserRoles.TRABAJADOR_CENTRO, UserRoles.MEDICO)
  @Patch('resultado/:id/resumen')
  @ApiOperation({
    summary: 'Attach or update the medical summary for a result',
  })
  @ApiResponse({ status: 200, description: 'Summary updated' })
  @ApiResponse({ status: 401, description: 'Missing or invalid token' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden — requires trabajador_centro or medico role',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['resumenMedico'],
      properties: {
        resumenMedico: {
          type: 'string',
          description: 'Texto del resumen medico generado',
        },
      },
    },
  })
  async updateResumenMedico(
    @Param('id') id: string,
    @Body('resumenMedico') resumenMedico: string,
  ) {
    return this.supabaseService.updateResumenMedico(id, resumenMedico);
  }

  @Auth(UserRoles.PACIENTE)
  @Get('resultado/mis-resultados')
  @ApiOperation({
    summary: 'Get all medical results for the authenticated patient',
  })
  @ApiResponse({ status: 200, description: 'List of results' })
  @ApiResponse({ status: 401, description: 'Missing or invalid token' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden — requires paciente role',
  })
  async getMisResultados(@GetUser('_id') pacienteId: string) {
    return this.supabaseService.getResultadosPaciente(pacienteId);
  }

  @Auth(UserRoles.TRABAJADOR_CENTRO, UserRoles.MEDICO)
  @Get('resultado/pacientes')
  @ApiOperation({ summary: 'Get all patient results (doctor/worker view)' })
  @ApiResponse({ status: 200, description: 'List of all patient results' })
  @ApiResponse({ status: 401, description: 'Missing or invalid token' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden — requires trabajador_centro or medico role',
  })
  async getAllResumen(@GetUser('_id') medicoId: string) {
    return this.supabaseService.getAllResumen(medicoId);
  }

  @Auth(UserRoles.TRABAJADOR_CENTRO, UserRoles.MEDICO, UserRoles.PACIENTE)
  @Get('get-pdf')
  @ApiOperation({ summary: 'Get public URL for a stored PDF' })
  @ApiResponse({ status: 200, description: 'Public URL for the file' })
  @ApiResponse({ status: 401, description: 'Missing or invalid token' })
  async getPublicUrl(@Query('path') path: string) {
    const responseFile = await this.supabaseService.getPublicUrl(path);
    return responseFile;
  }
}
