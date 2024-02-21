import { FastifyInstance } from 'fastify';

export default async function healthRoutes(fastify: FastifyInstance) {
  fastify.route({
    method: 'GET',
    url: '/health',
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            status: { type: 'string' },
          },
        },
        500: { $ref: 'ExceptionResponse#' },
      },
      tags: ['health'],
    },
    handler() {
      return { status: 'ok' };
    },
  });
}
