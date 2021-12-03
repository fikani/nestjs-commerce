import { applyDecorators } from '@nestjs/common';
import {
  ClassConstructor,
  instanceToPlain,
  plainToInstance,
  Transform,
} from 'class-transformer';

type In = ClassConstructor<any>;

interface DT {
  in?: ClassConstructor<any>;
  inFunc?: (value: any) => any;
  out?: (value: any) => any;
}

export const DT = (input: DT = {}): PropertyDecorator =>
  applyDecorators(
    Transform(
      (p) => {
        if (input.out === String) {
          return p.obj?.[p.key]?.toString();
        } else if (input.out) {
          return p.obj?.[p.key] ? input?.out(p.obj[p.key]) : p.obj?.[p.key];
        }
        return instanceToPlain(p.obj?.[p.key]);
      },
      {
        toPlainOnly: true,
      },
    ),
    Transform(
      (p) => {
        const { in: clazz, inFunc: fIn } = input;

        if (fIn) {
          return p.obj?.[p.key] ? fIn(p.obj[p.key]) : p.obj?.[p.key];
        }
        return clazz && p.obj?.[p.key]
          ? plainToInstance(clazz, p.obj[p.key])
          : p.obj?.[p.key];
      },
      {
        toClassOnly: true,
      },
    ),
  );
