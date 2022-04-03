import { asFunction, asValue, Resolver } from 'awilix';

export type Dependencies = {};

export function makeApplication(): { [dependency in keyof Dependencies]: Resolver<Dependencies[dependency]> } {
  return {};
}
