import * as Yup from 'yup';
import { ValidationException } from '@application/common/exceptions';
import { UpdatePostCommand } from './update-post-command';

export async function validate(command: UpdatePostCommand) {
  try {
    const schema: Yup.SchemaOf<UpdatePostCommand> = Yup.object().shape({
      id: Yup.number().required(),
      published: Yup.boolean().optional(),
      title: Yup.string().min(1).optional(),
    });

    await schema.validate(command, { abortEarly: false, strict: true });
  } catch (error) {
    throw new ValidationException(error as Yup.ValidationError);
  }
}
