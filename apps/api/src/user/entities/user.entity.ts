import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document, Types } from 'mongoose';

import { UserRole } from './enums/user-role.enum';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true, index: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    type: String,
    enum: UserRole,
    default: UserRole.PACIENTE,
  })
  role: UserRole;

  @Prop({ type: Date, required: true })
  fechaNacimiento: Date;

  @Prop({ type: Types.ObjectId, ref: 'CentroSalud', required: false })
  centroSalud_ID: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
