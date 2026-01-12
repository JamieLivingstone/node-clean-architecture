import Cors from '@fastify/cors';
import Helmet from '@fastify/helmet';
import type { Dependencies } from '@infrastructure/di';
import type { FastifyInstance } from 'fastify';
import urlShortenerController from './features/url-shortener/url-shortener-controller';
import dependencyInjectionPlugin from './plugins/dependency-injection';
import errorHandlerPlugin from './plugins/error-handler';
import healthPlugin from './plugins/health';
import rateLimitPlugin from './plugins/rate-limit';
import swaggerPlugin from './plugins/swagger';

export async function app(fastify: FastifyInstance, dependencies: Dependencies) {
  const { config } = dependencies;
  const isProduction = config.env === 'production';
  const corsOrigin = config.corsOrigin ?? !isProduction;

  fastify.addHook('onClose', async () => {
    await dependencies.dispose();
  });

  await fastify.register(dependencyInjectionPlugin, { dependencies });
  await fastify.register(Helmet, { global: true });
  await fastify.register(Cors, { origin: corsOrigin });

  if (!isProduction) {
    await fastify.register(swaggerPlugin);
  }

  await fastify.register(rateLimitPlugin);
  await fastify.register(errorHandlerPlugin);
  await fastify.register(healthPlugin);
  await fastify.register(urlShortenerController);

  return fastify;
}
