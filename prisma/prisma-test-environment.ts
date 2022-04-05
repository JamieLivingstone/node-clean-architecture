import { randomUUID } from 'crypto';
import { execSync } from 'child_process';
const { Client } = require('pg');
import { Config } from '@jest/types';
import NodeEnvironment from 'jest-environment-node';

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

module.exports = PrismaTestEnvironment;
