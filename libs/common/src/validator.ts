import { HttpStatus } from '@nestjs/common';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { validate, ValidationError } from 'class-validator';
import { DomainError } from './domain.error';

export const validationMessageParser = (input: ValidationError[]): string[] => {
  let errors = [];

  if (input.length) {
    if (input[0].constraints) {
      errors.push(...Object.values(input[0].constraints));
    }
    if (input?.[0]?.children.length) {
      errors.push(...validationMessageParser(input[0].children));
    }
  }

  return errors;
};

export const validateData = async (object: object) => {
  const errors = validationMessageParser(await validate(object));

  if (errors.length) {
    throw new HttpErrorByCode[HttpStatus.BAD_REQUEST](errors);
  }
};

export const validateConstraints = async (object: object) => {
  const errors = validationMessageParser(
    await validate(object, { whitelist: true }),
  );

  if (errors.length) {
    throw new DomainError(errors, false, DomainError.DATA_VALIDATION);
  }
};
