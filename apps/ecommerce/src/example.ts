import { Id } from '@app/common/id';
import { ApiProperty } from '@nestjs/swagger';
import { IsULID } from '@yuzu441/is-ulid';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class Example {
  @ApiProperty({ type: String })
  @Type(() => String)
  @IsNotEmpty()
  @IsULID()
  id: string = Id.generate();

  @ApiProperty({ type: Date })
  @Type(() => Date)
  @IsOptional()
  createdAt: Date;

  @ApiProperty({ type: Date })
  @Type(() => Date)
  @IsOptional()
  updatedAt: Date;
}
