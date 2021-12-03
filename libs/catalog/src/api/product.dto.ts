import { Id } from '@app/common/id';
import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsArray,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { IsULID } from '@yuzu441/is-ulid';
import { Product } from '../domain/product';
import { Sku } from '../domain/sku';
import { createPageResult } from '@app/common/repository';

export class CreateSku extends OmitType(Sku, ['id']) {
  @ApiPropertyOptional({ type: String })
  @Type(() => String)
  @IsNotEmpty()
  @IsULID()
  readonly id: string = Id.generate();
}

export class CreateProduct extends OmitType(Product, [
  'id',
  'createdAt',
  'updatedAt',
  'sku',
]) {
  @ApiPropertyOptional({ type: [CreateSku] })
  @Type(() => CreateSku)
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  readonly sku: CreateSku[] = [];
}

export class UpdateProduct extends PartialType(
  OmitType(Product, ['id', 'createdAt', 'updatedAt']),
) {}

export const ProductPage = createPageResult(Product);
