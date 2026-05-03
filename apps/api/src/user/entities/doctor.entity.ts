import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Especialidad } from 'src/auth/enum/especialidad.enum';
import { User } from 'src/auth/entities/user.entity';

@Schema({ timestamps: true })
export class Doctor extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  user: Types.ObjectId | User;

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

  @Prop({ type: [String], default: [] })
  slots: string[];
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);
