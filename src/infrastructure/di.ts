import { asFunction, asValue, Resolver } from 'awilix';
import { PrismaClient } from '@prisma/client';

export type Dependencies = {
  db: PrismaClient;
};

export function makeInfrastructure(): { [dependency in keyof Dependencies]: Resolver<Dependencies[dependency]> } {
  return {
    db: asValue(new PrismaClient()),
  };
}
