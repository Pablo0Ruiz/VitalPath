import { Document, Types } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { CitaState } from '../dto/enum/cita-state.enum';

@Schema({ timestamps: true })
export class Appointment extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  paciente_ID: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  medico_ID: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'CentroSalud', required: true })
  centroSalud_ID: Types.ObjectId;

  @Prop({ type: String, required: true, index: true })
  fecha: string;

  @Prop({ type: String, required: true, index: true })
  hora: string;

  @Prop({ type: String, enum: CitaState, default: CitaState.AGENDADA })
  estado: CitaState;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
