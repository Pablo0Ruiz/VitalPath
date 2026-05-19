import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SUPABASE_CLIENT } from './supabase.constants';
import { SupabaseClient } from '@supabase/supabase-js';
import { UploadFileResponseDto } from './dto/upload-file.dto';
import { UploadContextDto } from './dto/upload-context.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ResultadoEstudio } from 'src/user/entities/resultado-estudio.entity';
import { Patient } from 'src/user/entities/patient.entity';
import { Appointment } from 'src/appointment/entities/appointment.entity';
import { CitaState } from 'src/appointment/dto/enum/cita-state.enum';
import { Model, Types } from 'mongoose';
import { GroqService } from 'src/groq/groq.service';

const UPLOAD_TRANSITIONS: Partial<Record<CitaState, CitaState>> = {
  [CitaState.ASISTIDA]: CitaState.EN_PROCESO,
  [CitaState.EN_PROCESO]: CitaState.RESULTADOS_LISTOS,
  [CitaState.RESULTADOS_LISTOS]: CitaState.COMPLETADA,
};

@Injectable()
export class SupabaseService {
  constructor(
    @Inject(SUPABASE_CLIENT)
    private readonly supabase: SupabaseClient,
    @InjectModel(ResultadoEstudio.name)
    private readonly resultadoEstudioModel: Model<ResultadoEstudio>,
    @InjectModel(Patient.name)
    private readonly patientModel: Model<Patient>,
    @InjectModel(Appointment.name)
    private readonly appointmentModel: Model<Appointment>,
    private readonly groqService: GroqService,
  ) {}

  async uploadFile(
    files: Array<Express.Multer.File>,
    ctx: UploadContextDto,
  ): Promise<UploadFileResponseDto> {
    const file = files[0].buffer;
    const fileName = files[0].originalname;
    const uniqueName = `${Date.now()}-${fileName}`;
    const { data, error } = await this.supabase.storage
      .from(SUPABASE_CLIENT)
      .upload(`public/${ctx.paciente_ID}/${uniqueName}`, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: files[0].mimetype || 'application/pdf',
      });

    if (error) {
      throw new Error(`Error subiendo archivo: ${error.message}`);
    }

    let doctorUserId: Types.ObjectId | undefined;
    let cita: Appointment | null = null;

    if (ctx.cita_ID) {
      cita = await this.appointmentModel.findById(ctx.cita_ID);
      if (cita) doctorUserId = cita.medico_ID as Types.ObjectId;
    }

    const resultado = await this.resultadoEstudioModel.create({
      fileUrl: data.fullPath,
      medico_ID: doctorUserId,
      paciente_ID: ctx.paciente_ID
        ? new Types.ObjectId(ctx.paciente_ID)
        : undefined,
      cita_ID: ctx.cita_ID ? new Types.ObjectId(ctx.cita_ID) : undefined,
    });

    if (ctx.paciente_ID) {
      await this.patientModel.findOneAndUpdate(
        { user: new Types.ObjectId(ctx.paciente_ID) },
        { $push: { resultadosEstudio: resultado._id } },
      );
    }

    if (cita) {
      const nextEstado = UPLOAD_TRANSITIONS[cita.estado as CitaState];
      if (nextEstado) {
        await this.appointmentModel.findByIdAndUpdate(ctx.cita_ID, {
          estado: nextEstado,
        });
      }
    }

    return data;
  }

  async updateNotasMedico(
    id: string,
    notasMedico: string,
  ): Promise<ResultadoEstudio> {
    const resultado = await this.resultadoEstudioModel.findByIdAndUpdate(
      id,
      { notasMedico },
      { returnDocument: 'after' },
    );

    if (!resultado)
      throw new NotFoundException('Resultado de estudio no encontrado');

    return resultado;
  }

  private relativePath(path: string): string {
    const prefix = `${SUPABASE_CLIENT}/`;
    return path.startsWith(prefix) ? path.slice(prefix.length) : path;
  }

  async downloadFile(path: string): Promise<string> {
    const { data, error } = await this.supabase.storage
      .from(SUPABASE_CLIENT)
      .download(this.relativePath(path));

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
      .getPublicUrl(this.relativePath(path));

    if (!data) {
      throw new Error(`Error obteniendo URL pública`);
    }
    let resumen = 'Resumen no disponible temporalmente.';
    try {
      const base64Data = await this.downloadFile(path);
      resumen = await this.groqService.resumenResultadoEstudio(base64Data);
    } catch (error) {
      console.warn('Groq no disponible:', error.message);
    }
    return { publicUrl: data.publicUrl, resumen };
  }

  async getResultadosPaciente(pacienteId: string): Promise<ResultadoEstudio[]> {
    return this.resultadoEstudioModel
      .find({ paciente_ID: new Types.ObjectId(pacienteId) })
      .populate('cita_ID', 'fecha hora estado')
      .populate('medico_ID', 'name lastName especialidad');
  }

  async getAllResumen(medicoId: string): Promise<ResultadoEstudio[]> {
    const resultados = await this.resultadoEstudioModel
      .find({
        medico_ID: new Types.ObjectId(medicoId),
      })
      .populate('medico_ID', 'name lastName')
      .populate('paciente_ID', 'name lastName')
      .populate('cita_ID', 'fecha date');
    return resultados;
  }
}
