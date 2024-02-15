import { mockDeep } from 'jest-mock-extended';
import { PostsRepository } from '@application/common/interfaces';
import { NotFoundException, ValidationException } from '@application/common/exceptions';
import { Post } from '@domain/entities';
import { makeDeletePostCommand } from '../delete-post-command';

describe('deletePostCommand', () => {
  function setup() {
    const postsRepository = mockDeep<PostsRepository>({
      create: jest.fn().mockResolvedValue({}),
      getById: jest.fn().mockResolvedValue(
        new Post({
          id: 1,
          createdAt: new Date(2022, 1, 1),
          published: false,
          title: 'Mock post',
        }),
      ),
    });

    const deletePostCommand = makeDeletePostCommand({ postsRepository });

    return {
      deletePostCommand,
      postsRepository,
    };
  }

  test('deletes post', async () => {
    const { deletePostCommand, postsRepository } = setup();

    await deletePostCommand({ id: 1 });

    expect(postsRepository.delete).toHaveBeenCalledTimes(1);
  });

  describe('given the post does not exist', () => {
    test('throws not found exception', async () => {
      const { deletePostCommand, postsRepository } = setup();
      postsRepository.getById.mockResolvedValue(null);

      const result = deletePostCommand({ id: 3232 });

      await expect(result).rejects.toThrow(NotFoundException);
    });
  });

  describe('given an invalid command', () => {
    test('validates and throws validation exception', async () => {
      const { deletePostCommand } = setup();

      const result = deletePostCommand({
        id: 0, // Must be a positive number
      });

      await expect(result).rejects.toThrow(ValidationException);
    });
  });
});
