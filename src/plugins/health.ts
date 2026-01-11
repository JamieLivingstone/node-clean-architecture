import type { FastifyInstance } from 'fastify';

export default async function healthPlugin(fastify: FastifyInstance) {
  fastify.route({
    method: 'GET',
    url: '/health',
    schema: {
      summary: 'Liveness check',
      description:
        'Simple liveness probe that checks if the service process is running. Use this for Kubernetes liveness probes or basic uptime monitoring. Does not verify external dependencies.',
      response: {
        200: {
          type: 'object',
          properties: {
            status: { type: 'string' },
          },
          example: { status: 'ok' },
        },
      },
      tags: ['health'],
    },
    handler() {
      return { status: 'ok' };
    },
  });

  fastify.route({
    method: 'GET',
    url: '/ready',
    schema: {
      summary: 'Readiness check',
      description:
        'Readiness probe that verifies the service can handle traffic. Checks database connectivity and other critical dependencies. Use this for Kubernetes readiness probes or load balancer health checks.',
      response: {
        200: {
          type: 'object',
          properties: {
            status: { type: 'string' },
          },
          example: { status: 'ok' },
        },
        503: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            error: { type: 'string' },
          },
          example: { status: 'error', error: 'Database connection failed' },
        },
      },
      tags: ['health'],
    },
    async handler(_, reply) {
      try {
        await fastify.dependencies.db.$queryRaw`SELECT 1`;
        return { status: 'ok' };
      } catch (error) {
        const isProduction = fastify.dependencies.config.env === 'production';
        const message = isProduction
          ? 'Database unavailable'
          : error instanceof Error
            ? error.message
            : 'Unknown error';
        return reply.status(503).send({ status: 'error', error: message });
      }
    },
  });
}
