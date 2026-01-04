import { execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import type { EnvironmentContext, JestEnvironmentConfig } from '@jest/environment';
import dotenv from 'dotenv';
import NodeEnvironment from 'jest-environment-node';
import { Client } from 'pg';

dotenv.config();

const { DATABASE_URL } = process.env;

export default class PrismaTestEnvironment extends NodeEnvironment {
  private readonly schema: string;
  private readonly connectionString: string;

  constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
    super(config, context);
    this.schema = `test_${randomUUID()}`;
    this.connectionString = `${DATABASE_URL}?schema=${this.schema}`;
  }

  async setup() {
    process.env.DATABASE_URL = this.connectionString;
    this.global.process.env.DATABASE_URL = this.connectionString;
    execSync(`npx prisma migrate deploy`, { stdio: 'ignore' });

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
