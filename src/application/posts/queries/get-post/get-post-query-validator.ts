import { ValidationException } from '@application/common/exceptions';
import { ZodError, z } from 'zod';

import { GetPostQuery } from './get-post-query';

export async function validate(query: GetPostQuery) {
  try {
    const schema: z.ZodType<GetPostQuery> = z.object({
      id: z.string().uuid(),
    });

    await schema.parseAsync(query);
  } catch (error) {
    throw new ValidationException(error as ZodError);
  }
}
