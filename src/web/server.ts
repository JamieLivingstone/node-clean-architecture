import dotenv from 'dotenv';
import Fastify from 'fastify';

import app from './app';

dotenv.config();

async function start() {
  const fastify = Fastify({
    logger: {
      level: process.env.LOG_LEVEL,
    },
  });

  await app(fastify);

  const applicationConfig = fastify.diContainer.cradle.config;

  try {
    await fastify.listen({ port: applicationConfig.port });
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
}

start();
