import { randomUUID } from 'crypto';
import { execSync } from 'child_process';
import { Client } from 'pg';
import { Config } from '@jest/types';
import NodeEnvironment from 'jest-environment-node';
import { initializeDbForTests } from '../tests/api/seed';

export default class PrismaTestEnvironment extends NodeEnvironment {
  private readonly schema: string;
  private readonly connectionString: string;

  constructor(config: Config.ProjectConfig) {
    super(config);
    this.schema = `test_${randomUUID()}`;
    this.connectionString = `${process.env.DATABASE_URL}?schema=${this.schema}`;
  }

  async setup() {
    process.env.DATABASE_URL = this.connectionString;
    this.global.process.env.DATABASE_URL = this.connectionString;
    execSync(`npx prisma migrate deploy`, { stdio: 'ignore' });
    await initializeDbForTests();

    return super.setup();
  }

  async teardown() {
    const client = new Client({ connectionString: this.connectionString });
    await client.connect();
    await client.query(`DROP SCHEMA IF EXISTS "${this.schema}" CASCADE`);
    await client.end();

    return super.teardown();
  }
}
