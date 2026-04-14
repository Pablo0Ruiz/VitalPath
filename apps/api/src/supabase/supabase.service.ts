import { Inject, Injectable } from '@nestjs/common';
import { SUPABASE_CLIENT } from './supabase.constants';
import { SupabaseClient } from '@supabase/supabase-js';
import { UploadFileResponseDto } from './dto/upload-file.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ResultadoEstudio } from 'src/user/entities/resultado-estudio.entity';
import { Model } from 'mongoose';

@Injectable()
export class SupabaseService {
  constructor(
    @Inject(SUPABASE_CLIENT)
    private readonly supabase: SupabaseClient,
    @InjectModel(ResultadoEstudio.name)
    private readonly resultadoEstudioModel: Model<ResultadoEstudio>,
  ) {}

  async listBuckets(): Promise<unknown> {
    const { data, error } = await this.supabase.storage.listBuckets();

    if (error) {
      throw new Error(`Error listando buckets: ${error.message}`);
    }
    return data;
  }

  async uploadFile(
    files: Array<Express.Multer.File>,
  ): Promise<UploadFileResponseDto> {
    const file = files[0].buffer;
    const fileName = files[0].originalname;
    const { data, error } = await this.supabase.storage
      .from(SUPABASE_CLIENT)
      .upload(`public/${fileName}`, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw new Error(`Error subiendo archivo: ${error.message}`);
    }

    await this.resultadoEstudioModel.create({
      fileUrl: data.fullPath,
    });
    return data;
  }

  async getPublicUrl(path: string): Promise<string> {
    const { data } = await this.supabase.storage
      .from(SUPABASE_CLIENT)
      .getPublicUrl(path);

    if (!data) {
      throw new Error(`Error obteniendo URL pública`);
    }
    return data.publicUrl;
  }
}
