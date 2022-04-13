import * as Yup from 'yup';
import { ValidationException } from '@application/common/exceptions';
import { DeletePostCommand } from './delete-post-command';

export async function validate(command: DeletePostCommand) {
  try {
    const schema: Yup.SchemaOf<DeletePostCommand> = Yup.object().shape({
      id: Yup.number().positive().required(),
    });

    await schema.validate(command, { abortEarly: false, strict: true });
  } catch (error) {
    throw new ValidationException(error as Yup.ValidationError);
  }
}
