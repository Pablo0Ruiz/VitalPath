import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Especialidad } from 'src/auth/enum/especialidad.enum';

@Schema({ timestamps: true })
export class Doctor extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  user: Types.ObjectId;

  @Prop({
    type: String,
    enum: Especialidad,
    required: true,
  })
  especialidad: Especialidad;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Appointment' }],
    default: [],
  })
  citas: Types.ObjectId[];
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);
