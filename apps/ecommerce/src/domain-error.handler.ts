import { DomainError } from '@app/common/domain.error';
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';

@Catch(DomainError)
export class DomainErrorFilter extends BaseExceptionFilter {
  catch(exception: DomainError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    switch (exception.code) {
      case DomainError.ENTITY_NOT_FOUND: {
        return response
          .status(HttpStatus.NOT_FOUND)
          .json((new NotFoundException(exception.message) as any).response);
      }

      case DomainError.DATA_VALIDATION: {
        return response
          .status(HttpStatus.BAD_REQUEST)
          .json((new BadRequestException(exception.message) as any).response);
      }

      default: {
        return response
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json((new InternalServerErrorException() as any).response);
      }
    }
  }
}
