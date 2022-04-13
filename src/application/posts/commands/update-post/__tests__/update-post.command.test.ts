import { mockDeep } from 'jest-mock-extended';
import { IPostsRepository } from '@application/common/interfaces';
import { NotFoundException, ValidationException } from '@application/common/exceptions';
import { Post } from '@domain/entities';
import { makeUpdatePostCommand } from '../update-post-command';

describe('updatePostCommand', () => {
  function setup() {
    const postsRepository = mockDeep<IPostsRepository>({
      getById: jest.fn().mockResolvedValue(
        new Post({
          id: 1,
          createdAt: new Date(2022, 1, 1),
          published: false,
          title: 'Mock post',
        }),
      ),
      update: jest.fn().mockResolvedValue({}),
    });

    const updatePostCommand = makeUpdatePostCommand({ postsRepository });

    return {
      updatePostCommand,
      postsRepository,
    };
  }

  test('updates post', async () => {
    const { postsRepository, updatePostCommand } = setup();

    await updatePostCommand({
      id: 1,
      published: true,
      title: 'My first post',
    });

    expect(postsRepository.update).toHaveBeenCalledTimes(1);
  });

  describe('given the post does not exist', () => {
    test('throws not found exception', async () => {
      const { postsRepository, updatePostCommand } = setup();
      postsRepository.getById.mockResolvedValue(null);

      const result = updatePostCommand({
        id: 999,
        published: true,
      });

      await expect(result).rejects.toThrow(NotFoundException);
    });
  });

  describe('given an invalid command', () => {
    test('validates and throws validation exception', async () => {
      const { updatePostCommand } = setup();

      const result = updatePostCommand({
        id: 1,
        published: true,
        title: '', // Cannot be empty
      });

      await expect(result).rejects.toThrow(ValidationException);
    });
  });
});
