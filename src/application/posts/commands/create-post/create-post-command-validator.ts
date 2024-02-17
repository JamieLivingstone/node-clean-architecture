import { z, ZodError } from 'zod';
import { CreatePostCommand } from './create-post-command';
import { ValidationException } from '@application/common/exceptions';

export async function validate(command: CreatePostCommand) {
  try {
    const schema: z.ZodType<CreatePostCommand> = z.object({
      published: z.boolean(),
      title: z.string().min(1),
    });

    await schema.parseAsync(command);
  } catch (error) {
    throw new ValidationException(error as ZodError);
  }
}
