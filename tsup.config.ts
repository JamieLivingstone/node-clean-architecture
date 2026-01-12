import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/server.ts'],
  format: ['esm'],
  outDir: 'dist',
  clean: true,
  sourcemap: true,
  bundle: true,
  splitting: false,
  treeshake: true,
  external: ['@prisma/client', '@prisma/adapter-pg'],
  skipNodeModulesBundle: true,
});
