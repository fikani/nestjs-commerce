import { DomainError } from '@app/common/domain.error';
import { IsNotEmpty } from 'class-validator';
import { ulid } from 'ulid';
import { IsULID } from '@yuzu441/is-ulid';

export class Id {
  static create(id: string): Id;
  static create(id: Id): Id;
  static create(id: any): Id {
    if (typeof id === 'string') return new Id(id);
    if (id instanceof Id) return id;
    throw new DomainError(['invalid Id']);
  }

  static fromNullable(id: any): Id | null {
    if (typeof id === 'string') return new Id(id);
    if (id instanceof Id) return id;
    return null;
  }

  static generate(): string {
    return ulid();
  }

  @IsNotEmpty()
  @IsULID()
  private readonly value: string;

  constructor(value: string) {
    this.value = value;
  }

  equals(value: Id | string): boolean {
    return value?.toString() === this.value;
  }

  toObject(): string {
    return this.value;
  }

  toString(): string {
    return this.value;
  }
}
