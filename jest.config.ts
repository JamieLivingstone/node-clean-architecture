import dotenv from 'dotenv';
import { Config } from '@jest/types';
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

dotenv.config({ path: './.env.test' });

function makeProject(options: Partial<Config.InitialOptions>): Config.InitialOptions {
  return {
    collectCoverageFrom: ['<rootDir>/src'],
    coveragePathIgnorePatterns: ['<rootDir>/tests'],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
    testEnvironment: 'node',
    transform: {
      '^.+\\.ts?$': 'ts-jest',
    },
    ...options,
  };
}

const config: Config.InitialOptions = {
  projects: [
    makeProject({
      displayName: 'unit-tests',
      name: 'unit-tests',
      testMatch: ['<rootDir>/src/**/*.test.ts'],
    }),
    makeProject({
      displayName: 'functional-tests',
      name: 'functional-tests',
      testMatch: ['<rootDir>/tests/**/*.test.ts'],
      testEnvironment: '<rootDir>/prisma/prisma-test-environment.ts',
    }),
  ],
};

export default config;
