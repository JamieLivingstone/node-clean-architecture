import { asFunction, asValue, Resolver } from 'awilix';

export type Dependencies = {};

export function makeInfrastructure(): { [dependency in keyof Dependencies]: Resolver<Dependencies[dependency]> } {
  return {};
}
