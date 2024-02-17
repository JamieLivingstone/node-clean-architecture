import { ZodError } from 'zod';

export class ValidationException extends Error {
  constructor(error: ZodError) {
    super('Validation failed');
    this.name = 'ValidationException';
    this.stack = new Error().stack;
    this.details = error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));
  }

  details: { path: string; message: string }[];
}
