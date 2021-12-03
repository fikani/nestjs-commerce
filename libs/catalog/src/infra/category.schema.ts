import { NonFunctionProperties } from '@app/common/types.util';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Category } from '../domain/category';

@Schema()
export class CategoryModel implements NonFunctionProperties<Category> {
  id: string;

  @Prop({ type: String })
  _id: string;

  @Prop()
  name: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const CategorySchema = SchemaFactory.createForClass(CategoryModel);
