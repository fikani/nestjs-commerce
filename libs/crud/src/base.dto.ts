import { Id } from '@app/common/id';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsULID } from '@yuzu441/is-ulid';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class Entity {
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

export class CreateEntity extends OmitType(Entity, [
  'id',
  'createdAt',
  'updatedAt',
]) {}

export class UpdateEntity extends PartialType(
  OmitType(Entity, ['id', 'createdAt', 'updatedAt']),
) {}
