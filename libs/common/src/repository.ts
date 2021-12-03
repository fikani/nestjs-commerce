import { Type } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export interface Repository<E> {
  create(entity: Partial<E>): Promise<void>;
  update(entity: Partial<E>): Promise<void>;
  deleteById(id: string): Promise<void>;
  findById(id: string): Promise<E>;
  findAll(page: number, pageSize?: number): Promise<PageResult<E>>;
  find(query: any, page: number, pageSize: number): Promise<PageResult<E>>;
}

export interface PageResult<E> {
  data: E[];
  dataCount: number;
  total: number;
  pageCount: number;
  page: number;
  hasNext: boolean;
  nextParams?: Record<string, unknown>;
}

export function createPageResult<E>(type: Type<E>) {
  const A = class ConcretePageResult implements PageResult<E> {
    data: E[];
    dataCount: number;
    total: number;
    pageCount: number;
    page: number;
    hasNext: boolean;
    nextParams?: Record<string, unknown>;
  };

  ApiProperty({ type: [type] })(A.prototype, 'data');
  ApiProperty({ type: Number })(A.prototype, 'total');
  ApiProperty({ type: Number })(A.prototype, 'dataCount');
  ApiProperty({ type: Number })(A.prototype, 'pageCount');
  ApiProperty({ type: Number })(A.prototype, 'page');
  ApiProperty({ type: Object })(A.prototype, 'nextParams');
  ApiProperty({ type: Number })(A.prototype, 'hasNext');

  return A;
}
