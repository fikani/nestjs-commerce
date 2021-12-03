import { DT } from '@app/common/data.transformer';
import { Equals } from '@app/common/equals';
import { Id } from '@app/common/id';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsULID } from '@yuzu441/is-ulid';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Image } from './image';
import { Money } from './money';
import { ProductInfo } from './product-info';

export class SkuAttr {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  value: string;
}

export class Sku implements Equals<Sku | string> {
  @ApiProperty({ type: String })
  @Type(() => String)
  @IsOptional()
  @IsULID()
  id: string = Id.generate();

  @ApiProperty({ type: String })
  @Type(() => String)
  @IsNotEmpty()
  @IsULID()
  productId: string;

  @ApiProperty({ type: ProductInfo })
  @Type(() => ProductInfo)
  @ValidateNested()
  @IsNotEmpty()
  info: ProductInfo;

  @ApiPropertyOptional({ type: Image })
  @Type(() => Image)
  @ValidateNested()
  @IsOptional()
  image?: Image;

  @ApiProperty({ type: Money })
  @Type(() => Money)
  @ValidateNested()
  @IsNotEmpty()
  priceTag: Money;

  @ApiPropertyOptional({ type: [SkuAttr] })
  @Type(() => SkuAttr)
  @IsOptional()
  @ValidateNested({ each: true })
  attrs: SkuAttr[] = [];

  constructor(private readonly imageUrl: string) {}

  equals(other: Sku | string): boolean {
    if (other instanceof Sku) {
      return this.imageUrl === other.imageUrl;
    }
    if (typeof other === 'string') {
      return this.imageUrl === other;
    }
    return false;
  }
}

export enum SkuAttrType {
  number = 'numeric',
  TEXT = 'text',
}
