import supertest from 'supertest';
import { makeApp } from '@web/api/app';
import { makeContainer } from '@web/crosscutting/container';

function makeClient() {
  const dependencies = makeContainer();

  const app = makeApp(dependencies);

  return supertest(app);
}

export const client = makeClient();
