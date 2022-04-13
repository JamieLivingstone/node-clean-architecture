import * as Yup from 'yup';
import { ValidationException } from '@application/common/exceptions';
import { ListPostsQuery } from './list-posts-query';

export async function validate(query: ListPostsQuery) {
  try {
    const schema: Yup.SchemaOf<ListPostsQuery> = Yup.object().shape({
      pageNumber: Yup.number().min(1).required(),
      pageSize: Yup.number().min(1).max(50).required(),
    });

    await schema.validate(query, { abortEarly: false, strict: true });
  } catch (error) {
    throw new ValidationException(error as Yup.ValidationError);
  }
}
