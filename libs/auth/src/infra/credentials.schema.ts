import { NonFunctionProperties } from '@app/common/types.util';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Credentials } from '../domain/access/credentials';
import { Permission } from '../domain/access/premission';

@Schema({ timestamps: true })
export class CredentialsModel implements NonFunctionProperties<Credentials> {
  id: string;

  @Prop({ type: String })
  _id: string;

  @Prop({ index: true, type: String })
  userId: string;

  @Prop({ type: String })
  password: string;

  @Prop({ type: String })
  salt: string;

  @Prop({ type: [String] })
  permissions: Permission[];
}

export const CredentialsSchema = SchemaFactory.createForClass(CredentialsModel);
