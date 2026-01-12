import type { FastifyInstance } from 'fastify';
import { match } from 'ts-pattern';
import { createShortenedUrl } from './create-shortened-url';
import { redirectToUrl } from './redirect-to-url';

export default async function urlShortenerController(fastify: FastifyInstance) {
  fastify.route<{ Body: { url: string; expiresAt?: string } }>({
    method: 'POST',
    url: '/api/v1/shorten',
    schema: {
      summary: 'Create a shortened URL',
      tags: ['shortened-urls'],
      body: {
        type: 'object',
        required: ['url'],
        properties: {
          url: {
            type: 'string',
            maxLength: 2048,
            description: 'The URL to shorten',
            example: 'https://example.com/very/long/path',
          },
          expiresAt: {
            type: 'string',
            description: 'Optional expiration date',
            example: '2050-12-31T23:59:59Z',
          },
        },
      },
      response: {
        201: {
          description: 'Shortened URL created',
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
          required: ['id'],
        },
        400: { $ref: 'ErrorResponse#' },
        409: { $ref: 'ErrorResponse#' },
        500: { $ref: 'ErrorResponse#' },
      },
    },
    handler: async (request, reply) => {
      const result = await createShortenedUrl(
        { url: request.body.url, expiresAt: request.body.expiresAt ?? null },
        fastify.dependencies,
      );

      return match(result)
        .with({ type: 'success' }, ({ id }) => reply.status(201).send({ id }))
        .with({ type: 'id_collision' }, () =>
          reply.status(409).send({ message: 'ID collision after max retries', statusCode: 409 }),
        )
        .with({ type: 'error' }, () => reply.status(500).send({ message: 'Internal server error', statusCode: 500 }))
        .exhaustive();
    },
  });

  fastify.route<{ Params: { id: string } }>({
    method: 'GET',
    url: '/r/:id',
    schema: {
      summary: 'Redirect to original URL',
      description:
        'Redirects to the original URL and records the visit for analytics. Uses 302 (temporary redirect) to prevent caching.',
      tags: ['shortened-urls'],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: {
            type: 'string',
            description: 'The shortened URL ID',
            example: 'abc123XYZ0',
          },
        },
      },
      response: {
        302: {
          description: 'Redirect to original URL',
          type: 'null',
        },
        404: { $ref: 'ErrorResponse#' },
        410: { $ref: 'ErrorResponse#' },
      },
    },
    handler: async (request, reply) => {
      const result = await redirectToUrl(
        { id: request.params.id, referrer: request.headers.referer ?? null },
        fastify.dependencies,
      );

      return match(result)
        .with({ type: 'success' }, ({ originalUrl }) => reply.status(302).redirect(originalUrl))
        .with({ type: 'not_found' }, () =>
          reply.status(404).send({ message: 'Shortened URL not found', statusCode: 404 }),
        )
        .with({ type: 'expired' }, () =>
          reply.status(410).send({ message: 'Shortened URL has expired', statusCode: 410 }),
        )
        .exhaustive();
    },
  });
}
