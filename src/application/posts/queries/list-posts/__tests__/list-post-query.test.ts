import { mockDeep } from 'jest-mock-extended';
import { PostsRepository } from '@application/common/interfaces';
import { ValidationException } from '@application/common/exceptions';
import { Post } from '@domain/entities';
import { makeListPostQuery } from '../list-posts-query';

describe('listPostsQuery', () => {
  function setup() {
    const postsRepository = mockDeep<PostsRepository>();
    const listPostQuery = makeListPostQuery({ postsRepository });

    return {
      listPostQuery,
      postsRepository,
    };
  }

  test('lists posts', async () => {
    const { listPostQuery, postsRepository } = setup();

    postsRepository.list.mockResolvedValueOnce({
      count: 11,
      posts: [
        new Post({
          id: 11,
          createdAt: new Date(2022, 1, 1),
          published: false,
          title: 'Mock post',
        }),
      ],
    });

    const result = await listPostQuery({
      pageNumber: 2,
      pageSize: 10,
    });

    expect(result).toMatchSnapshot();
  });

  describe('given an invalid query', () => {
    test('validates and throws validation exception', async () => {
      const { listPostQuery } = setup();

      const result = listPostQuery({
        pageNumber: 1,
        pageSize: 1000, // Cannot exceed 50
      });

      await expect(result).rejects.toThrow(ValidationException);
    });
  });
});
