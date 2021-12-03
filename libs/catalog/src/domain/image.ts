import { Equals } from '@app/common/equals';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUrl } from 'class-validator';

export class Image implements Equals<Image | string> {
  @ApiProperty({ type: String })
  @IsUrl()
  @IsOptional()
  private readonly url: string;

  constructor(imageUrl: string) {
    this.url = imageUrl;
  }

  equals(other: Image | string): boolean {
    if (other instanceof Image) {
      return this.url === other.url;
    }
    if (typeof other === 'string') {
      return this.url === other;
    }
    return false;
  }

  toString() {
    return this.url;
  }
}
