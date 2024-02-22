import { ValidationException } from '@application/common/exceptions';
import { ZodError, z } from 'zod';

import { CreatePostCommand } from './create-post-command';

export async function validate(command: CreatePostCommand) {
  try {
    const schema: z.ZodType<CreatePostCommand> = z.object({
      title: z.string().min(1).max(150),
    });

    await schema.parseAsync(command);
  } catch (error) {
    throw new ValidationException(error as ZodError);
  }
}
