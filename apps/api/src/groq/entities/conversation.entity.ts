import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { nextMonday } from '../helpers/date.helpers';

@Schema({ timestamps: true })
export class Conversation extends Document {
  @Prop({ required: true, unique: true, index: true })
  chatId: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  lastMessage?: string;

  @Prop({ type: [Object], default: [] })
  messages: Record<string, unknown>[];

  @Prop({ type: Date, default: nextMonday, expires: 0 })
  expireAt: Date;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
