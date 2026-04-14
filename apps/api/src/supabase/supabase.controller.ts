import {
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('storage')
export class SupabaseController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Get('buckets')
  async listBuckets() {
    const buckets = await this.supabaseService.listBuckets();
    return { buckets };
  }

  @Post('upload-file')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    const responseFile = await this.supabaseService.uploadFile(files);
    return { responseFile, message: 'Archivo subido correctamente' };
  }
}
