import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class ResultadoEstudio extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Cita', required: true })
  cita_ID: Types.ObjectId;

  @Prop({ required: true, unique: true })
  fileUrl: string;

  @Prop({ required: true })
  resumenIA: string;
}

export const ResultadoEstudioSchema =
  SchemaFactory.createForClass(ResultadoEstudio);
