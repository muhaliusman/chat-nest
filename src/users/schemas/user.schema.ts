import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  _id: Types.ObjectId;

  @Prop()
  username: string;

  @Prop({
    select: false,
  })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
