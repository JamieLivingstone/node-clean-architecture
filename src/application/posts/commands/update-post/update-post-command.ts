import { Dependencies } from '@infrastructure/di';
import { NotFoundException } from '@application/common/exceptions';
import { validate } from './update-post-command-validator';

export type UpdatePostCommand = Readonly<{
  id: number;
  published?: boolean;
  title?: string;
}>;

export function makeUpdatePostCommand({ postsRepository }: Pick<Dependencies, 'postsRepository'>) {
  return async function updatePostCommand(command: UpdatePostCommand) {
    await validate(command);

    const { id, published, title } = command;

    const post = await postsRepository.getById({ id });

    if (!post) {
      throw new NotFoundException(`Post ${id} does does not exist`);
    }

    if (typeof published === 'boolean') {
      post.published = published;
    }

    if (title) {
      post.title = title;
    }

    await postsRepository.update({ post });
  };
}
