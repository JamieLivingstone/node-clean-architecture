import { mockDeep } from 'jest-mock-extended';
import { IPostsRepository } from '@application/common/interfaces';
import { ValidationException } from '@application/common/exceptions';
import { makeCreatePostCommand } from '../create-post-command';

describe('createPostCommand', () => {
  function setup() {
    const postsRepository = mockDeep<IPostsRepository>();
    const createPostCommand = makeCreatePostCommand({ postsRepository });

    return {
      createPostCommand,
      postsRepository,
    };
  }

  test('creates post', async () => {
    const { createPostCommand, postsRepository } = setup();
    postsRepository.create.mockResolvedValueOnce({ id: 1 });

    const result = await createPostCommand({
      published: true,
      title: 'My first post',
    });

    expect(result).toEqual({ id: 1 });
  });

  describe('given an invalid command', () => {
    test('validates and throws validation exception', async () => {
      const { createPostCommand } = setup();

      const result = createPostCommand({
        published: true,
        title: '', // Cannot be empty
      });

      await expect(result).rejects.toThrow(ValidationException);
    });
  });
});
