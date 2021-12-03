import { NonFunctionProperties } from '@app/common/types.util';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../domain/identity/user';

@Schema({ timestamps: true })
export class UserModel implements NonFunctionProperties<User> {
  id: string;

  @Prop({ type: String })
  _id: string;

  @Prop({ index: true, unique: true })
  email: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
