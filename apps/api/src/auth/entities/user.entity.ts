import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document, Types } from 'mongoose';

import { UserRoles } from '../enum/user-role.enum';
import { UserGenero } from '../enum/user-genero.enum';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, index: true, lowercase: true })
  name: string;

  @Prop({ required: true, index: true, lowercase: true })
  lastName: string;

  @Prop({ required: true, unique: true, index: true, lowercase: true })
  email: string;

  @Prop({
    select: false,
    required: true,
  })
  password: string;

  @Prop({
    type: String,
    enum: UserRoles,
    default: UserRoles.PACIENTE,
    required: false,
  })
  role: UserRoles;

  @Prop({ type: Date, required: true })
  fechaNacimiento: Date;

  @Prop({ type: Types.ObjectId, ref: 'CentroSalud', required: false })
  centroSalud_ID: Types.ObjectId;

  @Prop({
    type: String,
    enum: UserGenero,
    default: UserGenero.MASCULINO,
    required: true,
  })
  genero: UserGenero;

  @Prop({ type: String, required: false })
  fotoPerfil: string;

  @Prop({ type: String, required: false })
  telefono: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Medication' }],
    required: false,
    default: [],
  })
  medications: Types.ObjectId[];

  @Prop({ type: String, required: false })
  verificationCode?: string;

  @Prop({ type: Boolean, default: false })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
