import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

@Schema({ timestamps: true })
export class ResultadoEstudio extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Appointment', required: false })
  cita_ID: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  medico_ID: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  paciente_ID: Types.ObjectId;

  @Prop({ required: true, unique: true })
  fileUrl: string;

  @Prop({ required: false })
  @Prop({ required: false })
  resumenIA: string;

  @Prop({ required: false })
  resumenMedico: string;
}

export const ResultadoEstudioSchema =
  SchemaFactory.createForClass(ResultadoEstudio);
