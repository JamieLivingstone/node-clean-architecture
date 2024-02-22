import { ValidationException } from '@application/common/exceptions';
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

  describe('given an invalid query', () => {
    it('should throw a validation exception', async () => {
      // Arrange
      const { getPostQuery } = setup();

      // Act
      const result = getPostQuery({ id: 'invalid-id' });

      // Assert
      await expect(result).rejects.toThrow(ValidationException);
    });
  });

  describe('given the post does not exist', () => {
    it('should return null', async () => {
      // Arrange
      const { getPostQuery, postsRepository } = setup();
      postsRepository.getById.mockResolvedValue(null);

      // Act
      const result = await getPostQuery({ id: '907b0a0b-9a12-4073-ab27-3ad5927955e9' });

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
          id: '907b0a0b-9a12-4073-ab27-3ad5927955e9',
          createdAt: new Date(2022, 1, 1),
          title: 'Mock post',
        }),
      );

      // Act
      const result = await getPostQuery({ id: '907b0a0b-9a12-4073-ab27-3ad5927955e9' });

      // Assert
      expect(result).toMatchSnapshot();
    });
  });
});
