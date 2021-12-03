import { Equals } from '@app/common/equals';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ProductInfo implements Equals<ProductInfo | string> {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public readonly name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public readonly description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public readonly brand?: string;

  constructor() {}

  equals(other: ProductInfo | string): boolean {
    if (other instanceof ProductInfo) {
      return this.name === other.name;
    }
    if (typeof other === 'string') {
      return this.name === other;
    }
    return false;
  }

  toString() {
    return this.name;
  }
}
