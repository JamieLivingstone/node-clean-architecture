import { Dependencies } from '@infrastructure/di';
import { Post } from '@domain/entities';
import { validate } from './create-post-command-validator';

export type CreatePostCommand = Readonly<{
  published: boolean;
  title: string;
}>;

export function makeCreatePostCommand({ postsRepository }: Pick<Dependencies, 'postsRepository'>) {
  return async function createPostCommand(command: CreatePostCommand) {
    await validate(command);

    const post = new Post({
      createdAt: new Date(),
      published: command.published,
      title: command.title,
    });

    const { id } = await postsRepository.create({ post });

    return {
      id,
    };
  };
}
