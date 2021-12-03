import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { AuthApi } from './api/auth.api';
import { CreateUserDTO, UserApi } from './api/user.api';
import { User } from './domain/identity/user';

@Controller('user')
export class UserController {
  constructor(private userApi: UserApi, private authApi: AuthApi) {}

  @ApiOkResponse({ type: User })
  @Post('/register')
  async register(@Body() userData: CreateUserDTO): Promise<User> {
    const user = await this.userApi.create(userData);
    await this.authApi.addCredentials(user.id, userData.password);

    return user;
  }
}
