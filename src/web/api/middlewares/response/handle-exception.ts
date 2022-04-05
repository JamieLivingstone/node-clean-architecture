import { NextFunction, Request, Response } from 'express';
import * as Exceptions from '@application/common/exceptions';

type ExceptionResponse = {
  detail?: string; // A human-readable explanation specific to this occurrence of the problem.
  errors?: string[]; // Error details (validation result etc)
  status: number; // The HTTP status code
  title: string; // A short, human-readable summary of the problem type
  type: string; // A URI reference that identifies the problem type. (https://datatracker.ietf.org/doc/html/rfc7231)
};

export function makeHandleException() {
  return function handler(error: Error, request: Request, response: Response, _: NextFunction) {
    let exception: ExceptionResponse | null = null;

    switch (error.constructor) {
      case Exceptions.BadRequestException:
        exception = badRequestExceptionResponse(error);
        break;
      case Exceptions.NotFoundException:
        exception = notFoundExceptionResponse(error);
        break;
      default:
        exception = internalServerException();
    }

    return response.status(exception.status).json(exception);
  };
}

function badRequestExceptionResponse({ message }: Exceptions.BadRequestException): ExceptionResponse {
  return {
    ...(message && { detail: message }),
    status: 400,
    title: 'The request was invalid',
    type: 'https://tools.ietf.org/html/rfc7231#section-6.5.4',
  };
}

function notFoundExceptionResponse({ message }: Exceptions.NotFoundException): ExceptionResponse {
  return {
    ...(message && { detail: message }),
    status: 404,
    title: 'The specified resource was not found',
    type: 'https://tools.ietf.org/html/rfc7231#section-6.5.4',
  };
}

function internalServerException(): ExceptionResponse {
  return {
    status: 500,
    title: 'An error occurred while processing your request',
    type: 'https://tools.ietf.org/html/rfc7231#section-6.6.1',
  };
}
