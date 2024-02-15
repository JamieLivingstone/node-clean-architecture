import { mockDeep } from 'jest-mock-extended';
import { PostsRepository } from '@application/common/interfaces';
import { NotFoundException } from '@application/common/exceptions';
import { Post } from '@domain/entities';
import { makeGetPostQuery } from '../get-post-query';

describe('getPostQuery', () => {
  function setup() {
    const postsRepository = mockDeep<PostsRepository>({
      getById: jest.fn().mockResolvedValue(
        new Post({
          id: 1,
          createdAt: new Date(2022, 1, 1),
          published: false,
          title: 'Mock post',
        }),
      ),
    });

    const getPostQuery = makeGetPostQuery({ postsRepository });

    return {
      getPostQuery,
      postsRepository,
    };
  }

  test('gets post and returns domain transfer object', async () => {
    const { getPostQuery } = setup();

    const result = await getPostQuery({ id: 1 });

    expect(result).toMatchSnapshot();
  });

  describe('given the post does not exist', () => {
    test('throws not found exception', async () => {
      const { getPostQuery, postsRepository } = setup();
      postsRepository.getById.mockResolvedValue(null);

      const result = getPostQuery({ id: 1 });

      await expect(result).rejects.toThrow(NotFoundException);
    });
  });
});
