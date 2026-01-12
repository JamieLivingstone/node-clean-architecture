import type { FastifyError, FastifyInstance, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import { ZodError } from 'zod';

type ValidationError = {
  field: string;
  message: string;
};

type ErrorResponse = {
  message: string;
  statusCode: number;
  errors?: ValidationError[];
};

function buildErrorResponse(error: Error, logger: FastifyInstance['log']): ErrorResponse {
  if (error instanceof ZodError) {
    logger.warn({ issues: error.issues }, 'Validation failed');
    return {
      message: 'Validation failed',
      statusCode: 400,
      errors: error.issues.map((issue) => ({
        field: issue.path.join('.') || 'root',
        message: issue.message,
      })),
    };
  }

  const fastifyError = error as FastifyError;

  if (fastifyError.statusCode === 400 && fastifyError.validation) {
    logger.warn({ validation: fastifyError.validation }, 'Validation failed');
    return {
      message: 'Validation failed',
      statusCode: 400,
      errors: fastifyError.validation.map((v) => ({
        field: v.instancePath || (v.params?.missingProperty as string) || 'root',
        message: v.message ?? 'Invalid value',
      })),
    };
  }

  if (fastifyError.statusCode === 404) {
    return { message: 'Not found', statusCode: 404 };
  }

  logger.error({ error }, 'Unhandled error');
  return { message: 'Internal server error', statusCode: 500 };
}

async function errorHandlerPlugin(fastify: FastifyInstance) {
  fastify.setErrorHandler((error: FastifyError, _, reply: FastifyReply) => {
    const response = buildErrorResponse(error, fastify.log);
    return reply.status(response.statusCode).send(response);
  });

  fastify.setNotFoundHandler((_, reply) => {
    return reply.status(404).send({ message: 'Not found', statusCode: 404 });
  });

  fastify.addSchema({
    $id: 'ErrorResponse',
    type: 'object',
    properties: {
      message: { type: 'string' },
      statusCode: { type: 'integer' },
      errors: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            field: { type: 'string' },
            message: { type: 'string' },
          },
          required: ['field', 'message'],
        },
      },
    },
    required: ['message', 'statusCode'],
  });
}

export default fp(errorHandlerPlugin, { name: 'error-handler-plugin' });
