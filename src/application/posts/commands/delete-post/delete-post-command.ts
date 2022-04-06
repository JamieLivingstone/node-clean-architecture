import { Dependencies } from '@infrastructure/di';
import { validate } from './delete-post-command-validator';
import { NotFoundException } from '@application/common/exceptions';

export type DeletePostCommand = Readonly<{
  id: number;
}>;

export function makeDeletePostCommand({ postsRepository }: Pick<Dependencies, 'postsRepository'>) {
  return async function deletePostCommand(command: DeletePostCommand) {
    await validate(command);

    const { id } = command;

    const post = await postsRepository.getById({ id });

    if (!post) {
      throw new NotFoundException(`Post ${id} does does not exist`);
    }

    await postsRepository.delete({ id });
  };
}
