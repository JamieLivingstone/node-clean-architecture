import { ValidationException } from '@application/common/exceptions';
import { FastifyError, FastifyErrorCodes, FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

type ExceptionResponse = {
  errors?: { path?: string; message: string }[]; // Errors list
  status: number; // The HTTP status code
  type: string; // A URI reference that identifies the problem type (https://datatracker.ietf.org/doc/html/rfc7231)
};

// Map fastify error codes to custom exception responses
const fastifyErrorCodesMap = new Map<Partial<keyof FastifyErrorCodes>, (error: FastifyError) => ExceptionResponse>([
  [
    'FST_ERR_VALIDATION',
    (error) => ({
      errors: (error.validation ?? []).map((validationError) => ({
        path: validationError.instancePath,
        message: validationError.message ?? '',
      })),
      status: 400,
      type: 'https://datatracker.ietf.org/doc/html/rfc7231#section-6.5.1',
    }),
  ],
  [
    'FST_ERR_NOT_FOUND',
    () => ({
      status: 404,
      type: 'https://datatracker.ietf.org/doc/html/rfc7231#section-6.5.4',
    }),
  ],
]);

async function errorHandlerPlugin(fastify: FastifyInstance) {
  fastify.setErrorHandler((error, _, res) => {
    // Handle fastify errors
    const fastifyError = fastifyErrorCodesMap.get(error.code as keyof FastifyErrorCodes);

    if (fastifyError) {
      const response = fastifyError(error);
      return res.status(response.status).send(response);
    }

    // Handle custom application errors
    const applicationError: Error = error;

    if (applicationError instanceof ValidationException) {
      const { errors } = applicationError;

      return res.status(400).send({
        errors,
        status: 400,
        type: 'https://datatracker.ietf.org/doc/html/rfc7231#section-6.5.1',
      } satisfies ExceptionResponse);
    }

    // Catch all other errors
    fastify.log.error(error);

    return res.status(500).send({
      status: 500,
      type: 'https://datatracker.ietf.org/doc/html/rfc7231#section-6.6.1',
    } satisfies ExceptionResponse);
  });

  // Add the ExceptionResponse schema to the fastify instance
  fastify.addSchema({
    $id: 'ExceptionResponse',
    type: 'object',
    properties: {
      errors: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            path: { type: 'string' },
            message: { type: 'string' },
          },
        },
      },
      status: { type: 'number' },
      type: { type: 'string' },
    },
  });
}

// Export the plugin
export default fp(errorHandlerPlugin, {
  name: 'errorHandler',
});
