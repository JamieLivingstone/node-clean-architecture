import { PostsRepository } from '@application/common/interfaces';
import { Post } from '@domain/entities';
import { makeGetPostQuery } from '../get-post-query';

describe('getPostQuery', () => {
  function setup() {
    const postsRepository = jest.mocked<Partial<PostsRepository>>({
      getById: jest.fn(),
    }) as jest.Mocked<PostsRepository>;

    const getPostQuery = makeGetPostQuery({ postsRepository: postsRepository as PostsRepository });

    return {
      getPostQuery,
      postsRepository,
    };
  }

  describe('given the post does not exist', () => {
    it('should return null', async () => {
      // Arrange
      const { getPostQuery, postsRepository } = setup();
      postsRepository.getById.mockResolvedValue(null);

      // Act
      const result = await getPostQuery({ id: 1 });

      // Assert
      await expect(result).toEqual(null);
    });
  });

  describe('given the post exists', () => {
    it('should return the post', async () => {
      // Arrange
      const { getPostQuery, postsRepository } = setup();

      postsRepository.getById.mockResolvedValueOnce(
        new Post({
          id: 1,
          createdAt: new Date(2022, 1, 1),
          published: false,
          title: 'Mock post',
        }),
      );

      // Act
      const result = await getPostQuery({ id: 1 });

      // Assert
      expect(result).toMatchSnapshot();
    });
  });
});
