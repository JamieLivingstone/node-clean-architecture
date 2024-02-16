import Swagger from '@fastify/swagger';
import SwaggerUI from '@fastify/swagger-ui';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

async function swaggerGenerator(fastify: FastifyInstance) {
  await fastify.register(Swagger, {
    swagger: {
      info: {
        title: 'clean-architecture',
        description: 'The Swagger API documentation for the clean-architecture project.',
        version: '0.1.0',
      },
      host: 'localhost:3000',
      schemes: ['http', 'https'],
      consumes: ['application/json'],
      produces: ['application/json', 'text/html'],
      securityDefinitions: {
        Bearer: {
          type: 'apiKey',
          name: 'Bearer',
          in: 'header',
        },
      },
    },
  });

  await fastify.register(SwaggerUI, {
    routePrefix: '/api-docs',
  });
}

export default fp(swaggerGenerator, {
  name: 'swaggerGenerator',
});
