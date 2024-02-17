import Fastify from 'fastify';
import supertest from 'supertest';

import app from '@web/app';

export async function makeClient() {
  const fastify = Fastify();

  await app(fastify);

  await fastify.ready();

  return supertest(fastify.server);
}
