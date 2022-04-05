import { Request, Response } from 'express';

export function makeHandleNotFound() {
  return function handler(request: Request, response: Response) {
    return response.status(404).send({
      status: 404,
      title: 'The specified resource was not found.',
      type: 'https://tools.ietf.org/html/rfc7231#section-6.5.4',
    });
  };
}
