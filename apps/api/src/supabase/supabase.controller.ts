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
import { FilesInterceptor } from '@nestjs/platform-express';

import { SupabaseService } from './supabase.service';
import { UploadContextDto } from './dto/upload-context.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { UserRoles } from 'src/auth/enum/user-role.enum';

@Controller('storage')
export class SupabaseController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Auth(UserRoles.TRABAJADOR_CENTRO, UserRoles.MEDICO)
  @Post('upload-file')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFile(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() ctx: UploadContextDto,
  ) {
    const responseFile = await this.supabaseService.uploadFile(files, ctx);
    return { responseFile, message: 'Archivo subido correctamente' };
  }

  @Auth(UserRoles.TRABAJADOR_CENTRO, UserRoles.MEDICO)
  @Patch('resultado/:id/resumen')
  async updateResumenMedico(
    @Param('id') id: string,
    @Body('resumenMedico') resumenMedico: string,
  ) {
    return this.supabaseService.updateResumenMedico(id, resumenMedico);
  }
  @Auth(UserRoles.PACIENTE)
  @Get('resultado/mis-resultados')
  async getMisResultados(@GetUser('_id') pacienteId: string) {
    return this.supabaseService.getResultadosPaciente(pacienteId);
  }

  @Auth(UserRoles.TRABAJADOR_CENTRO, UserRoles.MEDICO)
  @Get('resultado/pacientes')
  async getAllResumen(@GetUser('_id') medicoId: string) {
    return this.supabaseService.getAllResumen(medicoId);
  }

  @Auth(UserRoles.TRABAJADOR_CENTRO, UserRoles.MEDICO, UserRoles.PACIENTE)
  @Get('get-pdf')
  async getPublicUrl(@Query('path') path: string) {
    const responseFile = await this.supabaseService.getPublicUrl(path);
    return responseFile;
  }
}
