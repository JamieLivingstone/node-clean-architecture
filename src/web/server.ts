import Fastify from 'fastify';
import app from './app';

async function start() {
  const fastify = Fastify();

  try {
    await app(fastify);

    await fastify.listen({ port: 3000 });

    fastify.diContainer.resolve('logger').info({
      message: 'Server is running. View the API documentation at http://localhost:3000/api-docs',
    });
  } catch (error) {
    fastify.diContainer.resolve('logger').error({
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });

    process.exit(1);
  }
}

start();
