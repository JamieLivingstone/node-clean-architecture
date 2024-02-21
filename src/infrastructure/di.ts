import * as Interfaces from '@application/common/interfaces';
import { makeConfig } from '@infrastructure/config';
import { PrismaClient } from '@prisma/client';
import { Resolver, asFunction, asValue } from 'awilix';

import { makeLogger } from './logger';
import * as repositories from './repositories';

export type Dependencies = {
  config: Interfaces.ApplicationConfig;
  db: PrismaClient;
  logger: Interfaces.Logger;
  postsRepository: Interfaces.PostsRepository;
};

export function makeInfrastructureDependencies(): {
  [dependency in keyof Dependencies]: Resolver<Dependencies[dependency]>;
} {
  const config = makeConfig();
  const logger = makeLogger(config);
  const db = new PrismaClient();

  db.$connect().catch(() => {
    logger.error({ detail: 'Failed to establish a connection to the database!' });
    process.exit(1);
  });

  return {
    config: asValue(config),
    db: asValue(db),
    logger: asValue(logger),
    postsRepository: asFunction(repositories.makePostsRepository).singleton(),
  };
}
