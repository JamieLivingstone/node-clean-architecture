import { execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import dotenv from 'dotenv';
import { Client } from 'pg';

dotenv.config();

const schema = `test_${randomUUID()}`;
const connectionString = `${process.env.DATABASE_URL}?schema=${schema}`;

export async function setup() {
  process.env.DATABASE_URL = connectionString;
  execSync('npx prisma migrate deploy --config prisma/prisma.config.ts', {
    stdio: 'ignore',
    env: { ...process.env, DATABASE_URL: connectionString },
  });
}

export async function teardown() {
  const client = new Client({ connectionString });
  await client.connect();
  await client.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
  await client.end();
}
