import { z, ZodError } from 'zod';
import { ValidationException } from '@application/common/exceptions';
import { DeletePostCommand } from './delete-post-command';

export async function validate(command: DeletePostCommand) {
  try {
    const schema: z.ZodType<DeletePostCommand> = z.object({
      id: z.number().int().positive(),
    });

    await schema.parseAsync(command);
  } catch (error) {
    throw new ValidationException(error as ZodError);
  }
}
