import { asFunction, asValue, Resolver } from 'awilix';
import { makePosts } from './posts';

export type Dependencies = {
  posts: ReturnType<typeof makePosts>;
};

export function makeApplication(): { [dependency in keyof Dependencies]: Resolver<Dependencies[dependency]> } {
  return {
    posts: asFunction(makePosts).singleton(),
  };
}
