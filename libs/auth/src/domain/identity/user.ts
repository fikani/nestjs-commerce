import { Id } from '@app/common/id';
import { ApiProperty } from '@nestjs/swagger';
import { IsULID } from '@yuzu441/is-ulid';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class User {
  @ApiProperty()
  @IsNotEmpty()
  @IsULID()
  id: string = Id.generate();

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsOptional()
  createdAt: Date;

  @ApiProperty()
  @IsOptional()
  updatedAt: Date;
}
