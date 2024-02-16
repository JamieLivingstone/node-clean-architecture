import { validate } from './delete-post-command-validator';

export type DeletePostCommand = Readonly<{
  id: number;
}>;

export function makeDeletePostCommand({ postsRepository }: Pick<Dependencies, 'postsRepository'>) {
  return async function deletePostCommand(command: DeletePostCommand) {
    await validate(command);

    const { id } = command;

    await postsRepository.delete({ id });
  };
}
