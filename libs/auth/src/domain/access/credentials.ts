import { Id } from '@app/common/id';
import { NonFunctionProperties } from '@app/common/types.util';
import { IsULID } from '@yuzu441/is-ulid';
import { Exclude } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Permission } from './premission';

export class SafeCredentials {
  @IsNotEmpty()
  @IsULID()
  readonly id: string = Id.generate();

  @IsNotEmpty()
  @IsULID()
  readonly userId: string;

  @IsArray()
  readonly permissions: Permission[] = [];
}

export class Credentials implements NonFunctionProperties<SafeCredentials> {
  @IsNotEmpty()
  @IsULID()
  readonly id: string = Id.generate();

  @IsNotEmpty()
  @IsULID()
  readonly userId: string;

  @IsArray()
  readonly permissions: Permission[] = [];

  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  readonly salt: string;
}
