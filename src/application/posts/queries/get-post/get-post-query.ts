import { toDto } from './get-post-query-mapper';
import { validate } from './get-post-query-validator';

export type GetPostQuery = Readonly<{
  id: string;
}>;

export function makeGetPostQuery({ postsRepository }: Pick<Dependencies, 'postsRepository'>) {
  return async function getPostQuery({ id }: GetPostQuery) {
    await validate({ id });

    const post = await postsRepository.getById({ id });

    if (!post) {
      return null;
    }

    return toDto(post);
  };
}
