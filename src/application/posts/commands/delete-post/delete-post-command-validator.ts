import { ValidationException } from '@application/common/exceptions';
import { type ZodError, z } from 'zod';

import type { DeletePostCommand } from './delete-post-command';

export async function validate(command: DeletePostCommand) {
  try {
    const schema: z.ZodType<DeletePostCommand> = z.object({
      id: z.string().uuid(),
    });

    await schema.parseAsync(command);
  } catch (error) {
    throw new ValidationException(error as ZodError);
  }
}
