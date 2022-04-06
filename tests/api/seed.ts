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
];
