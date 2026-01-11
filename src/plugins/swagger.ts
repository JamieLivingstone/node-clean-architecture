import Swagger from '@fastify/swagger';
import SwaggerUI from '@fastify/swagger-ui';
import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

async function swaggerGeneratorPlugin(fastify: FastifyInstance) {
  await fastify.register(Swagger, {
    swagger: {
      info: {
        title: 'API',
        description: 'API documentation',
        version: '0.1.0',
      },
      schemes: ['http', 'https'],
      consumes: ['application/json'],
      produces: ['application/json', 'text/html'],
    },
  });

  await fastify.register(SwaggerUI, {
    routePrefix: '/api-docs',
  });

  const { logger, config } = fastify.dependencies;
  logger.info(`API docs available at http://localhost:${config.port}/api-docs`);
}

export default fp(swaggerGeneratorPlugin, {
  name: 'swagger-generator-plugin',
  dependencies: ['dependency-injection-plugin'],
});
