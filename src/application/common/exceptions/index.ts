import type { ZodError } from 'zod';

export class ValidationException extends Error {
  constructor(error: ZodError) {
    super('APPLICATION_VALIDATION_ERROR');
    this.name = 'ValidationException';
    this.errors = error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));
  }

  errors: { path: string; message: string }[];
}
