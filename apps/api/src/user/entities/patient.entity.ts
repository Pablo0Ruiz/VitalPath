import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Patient extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  user: Types.ObjectId;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Medication' }],
    default: [],
  })
  medications: Types.ObjectId[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Appointment' }],
    default: [],
  })
  citas: Types.ObjectId[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'ResultadoEstudio' }],
    default: [],
  })
  resultadosEstudio: Types.ObjectId[];
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
