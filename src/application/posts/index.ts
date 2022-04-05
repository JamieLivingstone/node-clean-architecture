import { Dependencies } from '@infrastructure/di';
import { makeCreatePostCommand } from './commands/create-post';

export function makePosts(dependencies: Dependencies) {
  return {
    commands: {
      createPost: makeCreatePostCommand(dependencies),
    },
  };
}
