import { Dependencies as InfrastructureDependencies } from '../../src/infrastructure/di';

declare global {
  type Dependencies = InfrastructureDependencies;
}

declare module '@fastify/awilix' {
  interface Cradle extends Dependencies {}

  interface RequestCradle extends Dependencies {}
}
