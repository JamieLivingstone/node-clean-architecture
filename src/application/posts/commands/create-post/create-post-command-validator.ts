import * as Yup from 'yup';
import { ValidationException } from '@application/common/exceptions';
import { CreatePostCommand } from './create-post-command';

export async function validate(command: CreatePostCommand) {
  try {
    const schema: Yup.SchemaOf<CreatePostCommand> = Yup.object().shape({
      published: Yup.boolean().required(),
      title: Yup.string().min(1).required(),
    });

    await schema.validate(command, { abortEarly: false });
  } catch (error) {
    throw new ValidationException(error as Yup.ValidationError);
  }
}
