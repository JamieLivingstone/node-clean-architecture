import { ValidationException } from '@application/common/exceptions';
import type { PostsRepository } from '@application/common/interfaces';
import { Post } from '@domain/entities';

import { makeDeletePostCommand } from '../delete-post-command';

describe('deletePostCommand', () => {
  function setup() {
    const postsRepository = jest.mocked<Partial<PostsRepository>>({
      delete: jest.fn(),
      getById: jest.fn(),
    }) as jest.Mocked<PostsRepository>;

    const deletePostCommand = makeDeletePostCommand({ postsRepository });

    return {
      deletePostCommand,
      postsRepository,
    };
  }

  describe('given an invalid command', () => {
    it('should throw a validation exception', async () => {
      // Arrange
      const { deletePostCommand } = setup();

      // Act
      const result = deletePostCommand({
        id: 'invalid-uuid',
      });

      // Assert
      await expect(result).rejects.toThrow(ValidationException);
    });
  });

  describe('given a valid command', () => {
    it('should delete the post', async () => {
      // Arrange
      const { deletePostCommand, postsRepository } = setup();

      postsRepository.getById.mockResolvedValue(
        new Post({
          id: '907b0a0b-9a12-4073-ab27-3ad5927955e9',
          createdAt: new Date(2022, 1, 1),
          title: 'Mock post',
        }),
      );

      // Act
      await deletePostCommand({ id: '907b0a0b-9a12-4073-ab27-3ad5927955e9' });

      // Assert
      expect(postsRepository.delete).toHaveBeenCalledTimes(1);
    });
  });
});
