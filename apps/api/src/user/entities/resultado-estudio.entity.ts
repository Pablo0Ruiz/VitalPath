import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

@Schema({ timestamps: true })
export class ResultadoEstudio extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Cita', required: false })
  cita_ID: Types.ObjectId;

  @Prop({ required: true, unique: true })
  fileUrl: string;

  @Prop({ required: false })
  resumenIA: string;
}

export const ResultadoEstudioSchema =
  SchemaFactory.createForClass(ResultadoEstudio);
