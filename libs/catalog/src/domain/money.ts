import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import * as DineroModule from 'dinero.js';

export class Money {
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  readonly value: number;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  readonly currency: DineroModule.Currency;

  @Expose()
  get formatted(): string {
    return DineroModule({
      amount: this.value * 100,
      currency: this.currency,
    }).toFormat();
  }

  constructor(value: string, currency: DineroModule.Currency = 'BRL') {
    this.value = parseFloat(value);
    this.currency = currency;
  }
}
