import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document, Types } from 'mongoose';

import { UserRoles } from '../enum/user-role.enum';

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
  })
  role: UserRoles;

  @Prop({ type: Date, required: true })
  fechaNacimiento: Date;

  @Prop({ type: Types.ObjectId, ref: 'CentroSalud', required: false })
  centroSalud_ID: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
