import { NonFunctionProperties } from '@app/common/types.util';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Example } from './example';

@Schema({ timestamps: true })
export class ExmapleModel implements NonFunctionProperties<Example> {
  id: string;

  @Prop(() => String)
  _id: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const ExampleSchema = SchemaFactory.createForClass(Example);
