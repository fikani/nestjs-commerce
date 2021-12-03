import { Module } from '@nestjs/common';
import { AuthApi } from './api/auth.api';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CredentialsSchema } from './infra/credentials.schema';
import { Credentials } from './domain/access/credentials';
import { CredentialsRepository } from './domain/access/credentials.repository';
import { CrudModule } from '@app/crud';
import { User } from './domain/identity/user';
import { UserSchema } from './infra/user.schema';
import { UserApi } from './api/user.api';
import { AuthController } from './auth.controller';
import { UserController } from './user.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        '.env.development.local',
        '.env.development',
        '.env.staging',
        '.env',
      ],
    }),
    MongooseModule.forFeature([
      {
        name: Credentials.name,
        collection: Credentials.name,
        schema: CredentialsSchema,
      },
    ]),
    CrudModule.forFeature({
      entityClass: User,
      entitySchema: UserSchema,
      api: UserApi,
    }),
  ],
  controllers: [AuthController, UserController],
  providers: [AuthApi, CredentialsRepository],
  exports: [AuthApi],
})
export class AuthModule {}
