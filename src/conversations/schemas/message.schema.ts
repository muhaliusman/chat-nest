import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Types } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema({
  autoCreate: false,
})
export class Message {
  @Prop({ type: Types.ObjectId, ref: 'User' }) // Reference the User schema
  sender: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' }) // Reference the User schema
  receiver: Types.ObjectId;

  @Prop()
  message: string;

  @Prop({ default: Date.now })
  timestamp?: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
