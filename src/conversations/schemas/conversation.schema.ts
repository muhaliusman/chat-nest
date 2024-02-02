import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Message } from './message.schema';
import { User } from 'users/schemas/user.schema';

export type ConversationDocument = HydratedDocument<Message>;

@Schema()
export class Conversation {
  _id: Types.ObjectId;

  @Prop({ default: Date.now })
  time: Date;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  members: User[];

  @Prop({ type: [Message], default: [] })
  messages: Message[];

  @Prop({ default: 0 })
  total_messages: number;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
export interface Conversation extends ConversationDocument {}
