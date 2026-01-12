import type { Dependencies } from '@infrastructure/di';
import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyInstance {
    dependencies: Dependencies;
  }
}

interface PluginOptions {
  dependencies: Dependencies;
}

async function injectDependenciesPlugin(fastify: FastifyInstance, options: PluginOptions) {
  fastify.decorate('dependencies', options.dependencies);
}

export default fp(injectDependenciesPlugin, {
  name: 'dependency-injection-plugin',
});
