import { createContainer, Resolver } from 'awilix';
import { makeInfrastructure, Dependencies as InfrastructureDependencies } from '@infrastructure/di';
import { makeApplication, Dependencies as ApplicationDependencies } from '@application/di';

export type Dependencies = InfrastructureDependencies & ApplicationDependencies;

export function makeContainer() {
  const container = createContainer();

  container.register({
    ...makeInfrastructure(),
    ...makeApplication(),
  });

  return container.cradle as Dependencies;
}

export const dependencies = makeContainer();
