import AutoLoad from '@fastify/autoload';
import Cors from '@fastify/cors';
import Helmet from '@fastify/helmet';
import UnderPressure from '@fastify/under-pressure';
import { diContainer, fastifyAwilixPlugin } from '@fastify/awilix';
import { FastifyInstance } from 'fastify';
import { join } from 'path';
import { makeInfrastructureDependencies } from '@infrastructure/di';

export default async function makeApp(fastify: FastifyInstance) {
  // Auto-inject dependencies
  await fastify.register(fastifyAwilixPlugin);

  diContainer.register({
    ...makeInfrastructureDependencies(),
  });

  // Set sensible default security headers
  await fastify.register(Helmet, {
    global: true,
  });

  // Responds with 503 Service Unavailable if the event loop is blocked
  await fastify.register(UnderPressure, {
    maxEventLoopDelay: 1000,
    maxHeapUsedBytes: 1000000000,
    maxRssBytes: 1000000000,
    maxEventLoopUtilization: 0.98,
  });

  // Configure CORS
  await fastify.register(Cors, {
    origin: true,
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
