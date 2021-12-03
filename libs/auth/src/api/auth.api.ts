import { DomainError } from '@app/common/domain.error';
import { validateConstraints } from '@app/common/validator';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { pbkdf2, randomBytes } from 'crypto';
import * as jwt from 'jsonwebtoken';
import { Credentials, SafeCredentials } from '../domain/access/credentials';
import { CredentialsRepository } from '../domain/access/credentials.repository';
import { TokenDTO } from './token.dto';

@Injectable()
export class AuthApi {
  private readonly privateKey: string;
  private readonly publicKey: string;
  private readonly tokenExpiration: number;
  constructor(
    private readonly credentialsRepository: CredentialsRepository,
    private readonly configService: ConfigService,
  ) {
    this.privateKey = this.configService
      .get<string>('TOKEN_PRIVATE_KEY')
      .replace(/\\n/g, '\n');
    this.publicKey = this.configService
      .get<string>('TOKEN_PUBLIC_KEY')
      .replace(/\\n/g, '\n');

    this.tokenExpiration = Number(
      this.configService.get<string>('TOKEN_EXPIRATION'),
    );
  }

  // async tokenAtivacaoCadastro(usuario: Usuario): Promise<Token> {
  //   const persona = new Persona(usuario.id, usuario.email, [
  //     Permission.criar({
  //       nome: Permission.ATIVAR_CADASTRO,
  //       usuarioId: usuario.id,
  //     }),
  //   ]);
  //   const token = jwt.sign(
  //     {
  //       id: persona.usuarioId,
  //       email: persona.email,
  //       roles: persona.permissoes,
  //       exp: Date.now() / 1000 + this.tokenExpiration,
  //     },
  //     this.privateKey,
  //     {
  //       algorithm: this.configService.get<jwt.Algorithm>('TOKEN_ALG'),
  //     },
  //   );

  //   return Token.existente({ token });
  // }

  async login(userId: string, password: string): Promise<TokenDTO> {
    const creds = await this.validateCredentials(userId, password);

    const token = jwt.sign(
      {
        creds: creds,
        exp: Date.now() / 1000 + this.tokenExpiration,
      },
      this.privateKey,
      {
        algorithm: this.configService.get<jwt.Algorithm>('TOKEN_ALG'),
      },
    );

    return TokenDTO.from({ token });
  }

  async addCredentials(userId: string, password: string): Promise<void> {
    const salt = randomBytes(16).toString('hex');
    const masked = await this.generatePassword(password, salt);
    const credentials: Credentials = plainToInstance(Credentials, {
      password: masked,
      salt: salt,
      permissions: [],
      userId: userId,
    });
    validateConstraints(credentials);
    await this.credentialsRepository.create(credentials);
  }

  parseToken(token: string): SafeCredentials {
    try {
      const tokenObj: any = jwt.verify(token, this.publicKey);
      const creds = plainToInstance(SafeCredentials, tokenObj.creds);
      validateConstraints(creds);
      return creds;
    } catch (error) {
      throw new DomainError(['Ivalid token.']);
    }
  }

  private async validateCredentials(
    userId: string,
    pass: string,
  ): Promise<SafeCredentials> {
    const creds = await this.credentialsRepository.findByUserId(userId);

    if (!creds || !(await this.validatePassword(pass, creds))) {
      throw new DomainError(
        ['Invalid User or Password.'],
        false,
        DomainError.FORBIDDEN,
      );
    }
    return plainToInstance(SafeCredentials, creds);
  }

  private async validatePassword(
    pass: string,
    creds: Credentials,
  ): Promise<boolean> {
    const masked = await this.generatePassword(pass, creds.salt);
    return creds.password === masked;
  }

  private generatePassword(password: string, salt: string): Promise<string> {
    const iterations = +this.configService.get<number>('PWD_ITERATIONS'); //TODO: usar env var
    const keylen = +this.configService.get<number>('PWD_LEN');
    const digest = this.configService.get<string>('PWD_DIGEST');
    return new Promise((res, rej) => {
      pbkdf2(password, salt, iterations, keylen, digest, (err, key) => {
        err ? rej(err) : res(key.toString('hex'));
      });
    });
  }
}
