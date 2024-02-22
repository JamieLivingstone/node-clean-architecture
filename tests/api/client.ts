import { Post } from '@domain/entities';
import { Dependencies } from '@infrastructure/di';
import app from '@web/app';
import { randomUUID } from 'crypto';
import Fastify from 'fastify';
import supertest from 'supertest';

export async function makeClient() {
  const fastify = Fastify({ logger: true });

  await app(fastify);

  await fastify.ready();

  const seed = await seedDatabase(fastify.diContainer.cradle);

  return {
    client: supertest(fastify.server),
    seed,
  };
}

async function seedDatabase({ db }: Dependencies) {
  const posts: Post[] = [
    {
      id: randomUUID(),
      createdAt: new Date('2024-01-01T00:00:00Z'),
      title: 'First post',
    },
    {
      id: randomUUID(),
      createdAt: new Date('2024-01-02T04:24:00Z'),
      title: 'Second post',
    },
    {
      id: randomUUID(),
      createdAt: new Date('2024-01-03T00:00:00Z'),
      title: 'Third post',
    },
  ];

  await db.post.createMany({
    data: posts.map((post) => ({
      id: post.id,
      createdAt: post.createdAt,
      title: post.title,
    })),
  });

  return {
    posts,
  };
}
