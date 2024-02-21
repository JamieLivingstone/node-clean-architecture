import { Post } from '@domain/entities';

import { validate } from './create-post-command-validator';

export type CreatePostCommand = Readonly<{
  title: string;
}>;

export function makeCreatePostCommand({ postsRepository }: Pick<Dependencies, 'postsRepository'>) {
  return async function createPostCommand(command: CreatePostCommand) {
    await validate(command);

    const post = new Post({
      createdAt: new Date(),
      title: command.title,
    });

    const { id } = await postsRepository.create({ post });

    return {
      id,
    };
  };
}
