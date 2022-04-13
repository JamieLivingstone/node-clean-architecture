import { Dependencies } from '@infrastructure/di';
import { makeCreatePostCommand } from './commands/create-post';
import { makeDeletePostCommand } from './commands/delete-post';
import { makeUpdatePostCommand } from './commands/update-post';
import { makeGetPostQuery } from './queries/get-post';

export function makePosts(dependencies: Dependencies) {
  return {
    commands: {
      createPost: makeCreatePostCommand(dependencies),
      deletePost: makeDeletePostCommand(dependencies),
      updatePost: makeUpdatePostCommand(dependencies),
    },
    queries: {
      getPost: makeGetPostQuery(dependencies),
    },
  };
}
