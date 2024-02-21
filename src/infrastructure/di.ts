import * as Interfaces from '@application/common/interfaces';
import { PrismaClient } from '@prisma/client';
import { Resolver, asFunction, asValue } from 'awilix';

import { makeLogger } from './logger';
import * as repositories from './repositories';

export type Dependencies = {
  db: PrismaClient;
  logger: Interfaces.Logger;
  postsRepository: Interfaces.PostsRepository;
};

export function makeInfrastructureDependencies(): {
  [dependency in keyof Dependencies]: Resolver<Dependencies[dependency]>;
} {
  const logger = makeLogger();
  const db = new PrismaClient();

  db.$connect().catch(() => {
    logger.error({ detail: 'Failed to establish a connection to the database!' });
    process.exit(1);
  });

  return {
    db: asValue(db),
    logger: asValue(logger),
    postsRepository: asFunction(repositories.makePostsRepository).singleton(),
  };
}
