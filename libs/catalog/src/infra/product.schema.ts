import { Image } from '@app/catalog/domain/image';
import { Money } from '@app/catalog/domain/money';
import { Product } from '@app/catalog/domain/product';
import { ProductInfo } from '@app/catalog/domain/product-info';
import { Sku } from '@app/catalog/domain/sku';
import { NonFunctionProperties } from '@app/common/types.util';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as Mongoose } from 'mongoose';

@Schema({ timestamps: true })
export class ProductModel implements NonFunctionProperties<Product> {
  id: string;

  @Prop({ type: String })
  _id: string;

  @Prop({ type: ProductInfo })
  info: ProductInfo;

  @Prop({ type: Image })
  image: Image;

  @Prop({ type: Money })
  priceTag: Money;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;

  @Prop({ type: Mongoose.Types.Array })
  sku: Sku[];
}

export const ProductSchema = SchemaFactory.createForClass(ProductModel);

ProductSchema.path('sku.id', String);
