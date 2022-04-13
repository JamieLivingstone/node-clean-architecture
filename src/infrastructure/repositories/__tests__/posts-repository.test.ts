import { mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { makePostsRepository } from '../posts-repository';
import { Post } from '@domain/entities';

describe('postsRepository', () => {
  function setup() {
    const db = mockDeep<PrismaClient>();

    const postsRepository = makePostsRepository({
      db,
    });

    return {
      db,
      postsRepository,
    };
  }

  describe('create', () => {
    test('creates post and returns the id', async () => {
      const { db, postsRepository } = setup();

      db.post.create.mockResolvedValue({
        id: 1,
        createdAt: new Date(2022, 1, 1),
        published: true,
        title: 'Mock title',
      });

      const result = await postsRepository.create({
        post: new Post({
          createdAt: new Date(2022, 1, 1),
          published: true,
          title: 'Mock title',
        }),
      });

      expect(result.id).toEqual(1);
      expect(db.post.create).toHaveBeenCalledTimes(1);
      expect(db.post.create.mock.calls[0]).toMatchSnapshot();
    });
  });

  describe('delete', () => {
    test('deletes post', async () => {
      const { db, postsRepository } = setup();

      await postsRepository.delete({ id: 1 });

      expect(db.post.delete).toBeCalledTimes(1);
      expect(db.post.delete.mock.calls[0]).toMatchSnapshot();
    });
  });

  describe('getById', () => {
    test('returns null if the post does not exist', async () => {
      const { db, postsRepository } = setup();

      const result = await postsRepository.getById({ id: 1 });

      expect(result).toBeNull();
      expect(db.post.findFirst).toHaveBeenCalledTimes(1);
      expect(db.post.findFirst.mock.calls[0]).toMatchSnapshot();
    });

    test('returns post if it exists', async () => {
      const { db, postsRepository } = setup();

      db.post.findFirst.mockResolvedValue({
        id: 1,
        createdAt: new Date(2022, 1, 1),
        published: true,
        title: 'Mock title',
      });

      const result = await postsRepository.getById({ id: 1 });

      expect(result).toMatchSnapshot();
    });
  });

  describe('list', () => {
    test('list posts', async () => {
      const { db, postsRepository } = setup();

      db.post.count.mockResolvedValue(2);

      db.post.findMany.mockResolvedValue([
        {
          id: 1,
          createdAt: new Date(2022, 1, 1),
          published: true,
          title: 'Mock post one',
        },
        {
          id: 2,
          createdAt: new Date(2022, 2, 1),
          published: false,
          title: 'Mock post two',
        },
      ]);

      const result = await postsRepository.list({ pageNumber: 1, pageSize: 10 });

      expect(db.post.findMany).toBeCalledTimes(1);
      expect(db.post.findMany.mock.calls[0]).toMatchSnapshot();
      expect(result).toMatchSnapshot();
    });
  });

  describe('update', () => {
    test('updates post', async () => {
      const { db, postsRepository } = setup();

      await postsRepository.update({
        post: new Post({
          id: 1,
          createdAt: new Date(2022, 1, 1),
          published: true,
          title: 'Mock title',
        }),
      });

      expect(db.post.update).toHaveBeenCalledTimes(1);
      expect(db.post.update.mock.calls[0]).toMatchSnapshot();
    });
  });
});
