import { Document, Types } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { CitaState } from './enums/cita-state.enum';

@Schema({ timestamps: true })
export class Cita extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  paciente_ID: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  medico_ID: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'CentroSalud', required: true })
  centroSalud_ID: Types.ObjectId;

  @Prop({ type: Date, required: true })
  fechaHora: Date;

  @Prop({ type: String, enum: CitaState, default: CitaState.AGENDADA })
  estado: CitaState;
}

export const CitaSchema = SchemaFactory.createForClass(Cita);
