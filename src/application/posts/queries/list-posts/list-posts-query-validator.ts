import { z, ZodError } from 'zod';
import { ValidationException } from '@application/common/exceptions';
import { ListPostsQuery } from './list-posts-query';

export async function validate(query: ListPostsQuery) {
  try {
    const schema: z.ZodType<ListPostsQuery> = z.object({
      pageNumber: z.number().int().min(1),
      pageSize: z.number().int().min(1).max(50),
    });

    await schema.parseAsync(query);
  } catch (error) {
    throw new ValidationException(error as ZodError);
  }
}
