import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SUPABASE_CLIENT } from './supabase.constants';
import { SupabaseClient } from '@supabase/supabase-js';
import { UploadFileResponseDto } from './dto/upload-file.dto';
import { UploadContextDto } from './dto/upload-context.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ResultadoEstudio } from 'src/user/entities/resultado-estudio.entity';
import { Model, Types } from 'mongoose';
import { GeminiService } from 'src/gemini/gemini.service';

@Injectable()
export class SupabaseService {
  constructor(
    @Inject(SUPABASE_CLIENT)
    private readonly supabase: SupabaseClient,
    @InjectModel(ResultadoEstudio.name)
    private readonly resultadoEstudioModel: Model<ResultadoEstudio>,
    private readonly geminiService: GeminiService,
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
    medicoId: string,
    ctx: UploadContextDto,
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
      medico_ID: medicoId ? new Types.ObjectId(medicoId) : undefined,
      paciente_ID: ctx.paciente_ID
        ? new Types.ObjectId(ctx.paciente_ID)
        : undefined,
      cita_ID: ctx.cita_ID ? new Types.ObjectId(ctx.cita_ID) : undefined,
    });

    return data;
  }

  async updateResumenMedico(
    id: string,
    resumenMedico: string,
  ): Promise<ResultadoEstudio> {
    const resultado = await this.resultadoEstudioModel.findByIdAndUpdate(
      id,
      { resumenMedico },
      { new: true },
    );

    if (!resultado)
      throw new NotFoundException('Resultado de estudio no encontrado');

    return resultado;
  }

  async downloadFile(path: string): Promise<string> {
    const { data, error } = await this.supabase.storage
      .from(SUPABASE_CLIENT)
      .download(path);

    if (error) {
      throw new Error(`Error descargando archivo: ${error.message}`);
    }
    const arrayBuffer = await data.arrayBuffer();
    return Buffer.from(arrayBuffer).toString('base64');
  }

  async getPublicUrl(
    path: string,
  ): Promise<{ publicUrl: string; resumen: string }> {
    const { data } = this.supabase.storage
      .from(SUPABASE_CLIENT)
      .getPublicUrl(path);

    if (!data) {
      throw new Error(`Error obteniendo URL pública`);
    }
    let resumen = 'Resumen no disponible temporalmente.';
    try {
      const base64Data = await this.downloadFile(path);
      resumen = await this.geminiService.resumenResultadoEstudio(base64Data);
    } catch (error) {
      console.warn('Gemini no disponible:', error.message);
    }
    return { publicUrl: data.publicUrl, resumen };
  }
}
