import { randomUUID } from 'node:crypto';
import { makeDependencies } from '@infrastructure/di';
import Fastify, { type FastifyInstance } from 'fastify';
import supertest, { type Agent } from 'supertest';
import { app } from '../../../src/app';

export type { Agent };

let fastify: FastifyInstance | null = null;

export async function getTestClient(): Promise<Agent> {
  const dependencies = await makeDependencies();
  fastify = Fastify({
    ajv: { customOptions: { keywords: ['example'] } },
    logger: false,
    requestIdHeader: 'x-request-id',
    genReqId: () => randomUUID(),
  });
  await app(fastify, dependencies);
  await fastify.ready();
  return supertest(fastify.server);
}

export async function closeTestServer(): Promise<void> {
  if (fastify) {
    await fastify.close();
    fastify = null;
  }
}
