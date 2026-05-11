import { HttpException, HttpStatus } from "@nestjs/common";
import { measureMemory } from "vm";

interface details {
  reason: string;
  entityId: string;
}

type DeatilsStringMix = details | string;

export class DomainException extends HttpException {
  details?: DeatilsStringMix;
  constructor(message: string, status: HttpStatus, details?: DeatilsStringMix) {
      super(message, status);
      this.name = this.constructor.name;
      this.details = details
  }
}

// Entity not found
export class EntityNotFoundException extends DomainException {
  constructor(entityName: string, details?: DeatilsStringMix) {
    const message = `${entityName} not found`;
    super(message, HttpStatus.NOT_FOUND, details);
  }
}

// Entity already exists
export class EntityAlreadyExistsException extends DomainException {
  constructor(entityName: string, details?: DeatilsStringMix) {
    const message = `${entityName} already exist`
    super(message, HttpStatus.CONFLICT, details);
  }
}

// Invalid input
export class InvalidInputException extends DomainException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

// Authentication exceptions
export class AuthenticationException extends DomainException {
  constructor(message: string, details: DeatilsStringMix) {
    super(message, HttpStatus.UNAUTHORIZED, details);
  }
}

// OTP exceptions
export class OtpExpiredException extends DomainException {
  constructor() {
    super('OTP has expired', HttpStatus.BAD_REQUEST);
  }
}

export class OtpInvalidException extends DomainException {
  constructor() {
    super('Invalid OTP', HttpStatus.BAD_REQUEST);
  }
}

// Forbidden action
export class ForbiddenActionException extends DomainException {
  constructor(message: string) {
    super(message, HttpStatus.FORBIDDEN);
  }
}

// Value object exceptions
export class InvalidValueObjectException extends DomainException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

// Throttling exceptions
export class ThrottlingException extends DomainException {
  constructor(message: string) {
    super(message, HttpStatus.TOO_MANY_REQUESTS);
  }
}

export class InvalidThrottleIdentifierException extends DomainException {
  constructor() {
    super('Throttle identifier cannot be empty', HttpStatus.BAD_REQUEST);
  }
}