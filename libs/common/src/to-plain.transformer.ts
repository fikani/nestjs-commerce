import {
  Transform,
  TransformFnParams,
  TransformOptions,
} from 'class-transformer';

export const ToPlain = (
  transformFn: (value: any) => any,
  options?: TransformOptions,
): PropertyDecorator =>
  Transform((p) => transformFn(p.obj?.[p.key]), {
    toPlainOnly: true,
    ...(options ?? {}),
  });
