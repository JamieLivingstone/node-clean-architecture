import { Post } from '../../src/domain/entities';
import { PrismaClient } from '@prisma/client';

export async function initializeDbForTests() {
  const client = new PrismaClient();

  await Promise.all([
    client.post.createMany({
      data: posts.map((post) => ({
        createdAt: post.createdAt,
        published: post.published,
        title: post.title,
      })),
    }),
  ]);
}

export const posts: Array<Post> = [
  new Post({
    id: 1,
    createdAt: new Date(2022, 1, 1),
    published: false,
    title: 'Mock post one',
  }),
  new Post({
    id: 2,
    createdAt: new Date(2022, 2, 1),
    published: true,
    title: 'Mock post two',
  }),
  new Post({
    id: 3,
    createdAt: new Date(2022, 3, 1),
    published: false,
    title: 'Mock post three',
  }),
  new Post({
    id: 4,
    createdAt: new Date(2022, 4, 1),
    published: false,
    title: 'Mock post four',
  }),
  new Post({
    id: 5,
    createdAt: new Date(2022, 5, 1),
    published: true,
    title: 'Mock post five',
  }),
  new Post({
    id: 6,
    createdAt: new Date(2022, 6, 1),
    published: false,
    title: 'Mock post six',
  }),
];
