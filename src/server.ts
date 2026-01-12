import { randomUUID } from 'node:crypto';
import { makeDependencies } from '@infrastructure/di';
import dotenv from 'dotenv';
import Fastify, { type FastifyBaseLogger } from 'fastify';
import { app } from './app';

dotenv.config();

const dependencies = await makeDependencies();

const fastify = Fastify({
  ajv: { customOptions: { keywords: ['example'] } },
  loggerInstance: dependencies.logger as FastifyBaseLogger,
  requestTimeout: 30000,
  requestIdHeader: 'x-request-id',
  genReqId: () => randomUUID(),
});

await app(fastify, dependencies);

async function shutdown(signal: string) {
  const { logger } = dependencies;
  logger.info({ signal }, 'Received shutdown signal, closing server');
  try {
    await fastify.close();
    logger.info('Server closed successfully');
    process.exit(0);
  } catch (error) {
    logger.error({ error }, 'Error during shutdown');
    process.exit(1);
  }
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

await fastify.listen({
  port: dependencies.config.port,
  host: '0.0.0.0',
});
