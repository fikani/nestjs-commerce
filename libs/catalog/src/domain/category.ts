import { Id } from '@app/common/id';
import { IsULID } from '@yuzu441/is-ulid';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class Category {
  @IsNotEmpty()
  @IsULID()
  id: string = Id.generate();

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  createdAt: Date;

  @IsOptional()
  updatedAt: Date;
}
