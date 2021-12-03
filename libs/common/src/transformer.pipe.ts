import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ClassTransformOptions, plainToInstance } from 'class-transformer';

@Injectable()
export class TransformerPipe implements PipeTransform {
  constructor(private transformOptions?: ClassTransformOptions) {}
  transform(value: any, metadata: ArgumentMetadata) {
    const metatype = metadata.metatype;
    return plainToInstance(metatype, value, this.transformOptions);
  }
}
