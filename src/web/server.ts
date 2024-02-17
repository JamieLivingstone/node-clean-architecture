import Fastify from 'fastify';
import app from './app';

async function start() {
  const fastify = Fastify({
    logger: {
      level: process.env.LOG_LEVEL,
    },
  });

  await app(fastify);

  try {
    await fastify.listen({ port: 3000 });
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
}

start();
