import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { makeConfig } from './config';
import { makeLogger } from './logger';
import { makeShortenedUrlsRepository } from './repositories/shortened-urls-repository';
import { makeVisitsRepository } from './repositories/visits-repository';

export async function makeDependencies() {
  const config = makeConfig();
  const logger = makeLogger(config);
  const adapter = new PrismaPg({ connectionString: config.DATABASE_URL });
  const db = new PrismaClient({
    adapter,
    log: [
      { level: 'error', emit: 'event' },
      { level: 'warn', emit: 'event' },
    ],
  });

  db.$on('error', (e) => logger.error({ target: e.target, message: e.message }, 'Prisma error'));
  db.$on('warn', (e) => logger.warn({ target: e.target, message: e.message }, 'Prisma warning'));

  await db.$connect();

  const shortenedUrlsRepository = makeShortenedUrlsRepository(db);
  const visitsRepository = makeVisitsRepository(db);

  return {
    config,
    db,
    logger,
    repositories: {
      shortenedUrlsRepository,
      visitsRepository,
    },
    dispose: async () => {
      await db.$disconnect();
    },
  };
}

export type Dependencies = Awaited<ReturnType<typeof makeDependencies>>;

export type UseCaseDependencies = Pick<Dependencies, 'logger' | 'repositories'>;
