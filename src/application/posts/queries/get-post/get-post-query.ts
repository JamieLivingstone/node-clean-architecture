import { toDto } from './get-post-query-mapper';

export type GetPostQuery = Readonly<{
  id: number;
}>;

export function makeGetPostQuery({ postsRepository }: Pick<Dependencies, 'postsRepository'>) {
  return async function getPostQuery({ id }: GetPostQuery) {
    const post = await postsRepository.getById({ id });

    if (!post) {
      return null;
    }

    return toDto(post);
  };
}
