import { Dependencies } from '@infrastructure/di';
import { NotFoundException } from '@application/common/exceptions';
import { toDto } from './get-post-query-mapper';

export type GetPostQuery = Readonly<{
  id: number;
}>;

export function makeGetPostQuery({ postsRepository }: Pick<Dependencies, 'postsRepository'>) {
  return async function getPostQuery({ id }: GetPostQuery) {
    const post = await postsRepository.getById({ id });

    if (!post) {
      throw new NotFoundException(`Post ${id} does does not exist`);
    }

    return toDto(post);
  };
}
