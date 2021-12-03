import { Id } from '@app/common/id';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsULID } from '@yuzu441/is-ulid';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Image } from './image';
import { ProductInfo } from './product-info';
import { Sku } from './sku';

export class Product {
  @ApiProperty({ type: String })
  @Type(() => String)
  @IsNotEmpty()
  @IsULID()
  readonly id: string = Id.generate();

  @ApiProperty({ type: ProductInfo })
  @Type(() => ProductInfo)
  @IsNotEmpty()
  @ValidateNested()
  readonly info: ProductInfo;

  @ApiPropertyOptional({ type: Image })
  @Type(() => Image)
  @IsOptional()
  @ValidateNested()
  readonly image?: Image;

  @ApiProperty({ type: Date })
  @Type(() => Date)
  @IsOptional()
  readonly createdAt: Date;

  @ApiProperty({ type: Date })
  @Type(() => Date)
  @IsOptional()
  readonly updatedAt: Date;

  @ApiPropertyOptional({ type: [Sku] })
  @Type(() => Sku)
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  readonly sku: Sku[] = [];
}
