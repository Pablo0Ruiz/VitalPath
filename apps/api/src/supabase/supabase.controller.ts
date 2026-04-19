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

  @Get('buckets')
  async listBuckets() {
    const buckets = await this.supabaseService.listBuckets();
    return { buckets };
  }

  @Auth(UserRoles.TRABAJADOR_CENTRO, UserRoles.MEDICO)
  @Post('upload-file')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFile(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @GetUser('_id') medicoId: string,
    @Body() ctx: UploadContextDto,
  ) {
    const responseFile = await this.supabaseService.uploadFile(
      files,
      medicoId,
      ctx,
    );
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

  @Auth(UserRoles.TRABAJADOR_CENTRO, UserRoles.MEDICO)
  @Get('get-pdf')
  async getPublicUrl(@Query('path') path: string) {
    const responseFile = await this.supabaseService.getPublicUrl(path);
    return { responseFile, message: 'Archivo subido correctamente' };
  }
}
