import { asFunction, asValue, Resolver } from 'awilix';
import { PrismaClient } from '@prisma/client';
import * as Interfaces from '@application/common/interfaces';
import * as repositories from './repositories';

export type Dependencies = {
  db: PrismaClient;
  postsRepository: Interfaces.IPostsRepository;
};

export function makeInfrastructure(): { [dependency in keyof Dependencies]: Resolver<Dependencies[dependency]> } {
  return {
    db: asValue(new PrismaClient()),
    postsRepository: asFunction(repositories.makePostsRepository).singleton(),
  };
}
