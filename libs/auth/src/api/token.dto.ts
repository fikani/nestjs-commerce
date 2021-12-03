import { ApiProperty } from '@nestjs/swagger';

export class TokenDTO {
  static from({ token }: { token: string }): TokenDTO {
    return new TokenDTO(token);
  }

  @ApiProperty()
  readonly token: string;

  constructor(token: string) {
    this.token = token;
  }
}
