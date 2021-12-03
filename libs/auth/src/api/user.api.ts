import { DomainError } from '@app/common/domain.error';
import { BaseApi } from '@app/crud/base.api';
import { Inject, Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { User } from '../domain/identity/user';

@Injectable()
export class UserApi extends BaseApi<User, CreateUserDTO> {
  constructor(@Inject('UserRepository') repository) {
    super(repository, User);
  }

  async getByEmail(email: string): Promise<User> {
    const result = await this.repository.find({ email: email }, 1, 1);
    return result.data?.[0] ?? null;
  }

  async create(user: CreateUserDTO): Promise<User> {
    const existingUser = this.getByEmail(user.email);

    if (existingUser) {
      throw new DomainError(['Email in use.']);
    }

    return super.create(user);
  }
}

export class CreateUserDTO {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
