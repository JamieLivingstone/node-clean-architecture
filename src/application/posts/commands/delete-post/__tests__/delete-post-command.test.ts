import { PostsRepository } from '@application/common/interfaces';
import { ValidationException } from '@application/common/exceptions';
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
        id: 0, // Must be a positive number
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
          id: 1,
          createdAt: new Date(2022, 1, 1),
          published: false,
          title: 'Mock post',
        }),
      );

      // Act
      await deletePostCommand({ id: 1 });

      // Assert
      expect(postsRepository.delete).toHaveBeenCalledTimes(1);
    });
  });
});
