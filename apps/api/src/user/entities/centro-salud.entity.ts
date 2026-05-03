import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export enum HospitalType {
  GENERAL = 'GEN',
  CLINICA = 'CLI',
  LABORATORIO = 'LAB',
  URGENCIAS = 'URG',
  FARMACIA = 'FAR',
}

@Schema({ timestamps: true })
export class CentroSalud {
  @Prop({ required: true, unique: true, trim: true })
  nombre: string;

  @Prop({ required: true, trim: true })
  direccion: string;

  @Prop({
    required: true,
    enum: HospitalType,
    default: HospitalType.GENERAL,
  })
  tipo: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  listaMedicos_ID: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  listaTrabajadores_ID: Types.ObjectId[];

  @Prop({ required: false, unique: true, trim: true })
  codigoVinculacion: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  admin_ID: Types.ObjectId;
}

export const CentroSaludSchema = SchemaFactory.createForClass(CentroSalud);
