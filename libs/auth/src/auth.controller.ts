import {
  Body,
  Controller,
  Inject,
  NotFoundException,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { AuthApi } from './api/auth.api';
import { TokenDTO } from './api/token.dto';
import { UserApi } from './api/user.api';

export class Login {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authApi: AuthApi, private userApi: UserApi) {}

  @ApiOkResponse({ type: TokenDTO })
  @Post('/login/password')
  async login(@Body() login: Login): Promise<TokenDTO> {
    const user = await this.userApi.getByEmail(login.email);

    if (!user) {
      throw new NotFoundException(['User not found']);
    }

    return this.authApi.login(user.email, login.password);
  }
}
