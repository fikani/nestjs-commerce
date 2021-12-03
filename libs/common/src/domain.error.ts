export class DomainError extends Error {
  static readonly ENTITY_NOT_FOUND = 'ENTITY_NOT_FOUND';
  static readonly DATA_VALIDATION = 'DATA_VALIDATION';
  static readonly BUSINESS_RULE = 'BUSINESS_RULE';
  static readonly FORBIDDEN = 'FORBIDDEN';

  constructor(
    message: string[] = [],
    public readonly humanReadable: boolean = false,
    public readonly code: string = DomainError.DATA_VALIDATION,
    public readonly operacional: boolean = true,
  ) {
    super(null);
    this.message = message as any;

    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain

    this.name = this.constructor.name;

    Error.captureStackTrace(this);
  }
}
