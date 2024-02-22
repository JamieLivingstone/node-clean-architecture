import AutoLoad from '@fastify/autoload';
import { diContainer, fastifyAwilixPlugin } from '@fastify/awilix';
import Cors from '@fastify/cors';
import Helmet from '@fastify/helmet';
import { makeInfrastructureDependencies } from '@infrastructure/di';
import { FastifyInstance } from 'fastify';
import { join } from 'path';

export default async function makeApp(fastify: FastifyInstance) {
  // Create a dependency injection container
  await fastify.register(fastifyAwilixPlugin);

  diContainer.register({
    ...makeInfrastructureDependencies(),
  });

  // Set sensible default security headers
  await fastify.register(Helmet, {
    global: true,
  });

  // Configure CORS
  await fastify.register(Cors, {
    origin: false, // TODO: Set this to a valid origin
  });

  // Auto-load plugins
  await fastify.register(AutoLoad, {
    dir: join(__dirname, 'plugins'),
    dirNameRoutePrefix: false,
  });

  // Auto-load routes
  await fastify.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
    dirNameRoutePrefix: false,
  });

  return fastify;
}
