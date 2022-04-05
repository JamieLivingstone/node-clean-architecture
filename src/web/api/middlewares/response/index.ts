import { Application } from 'express';
import { makeHandleNotFound } from './handle-not-found';
import { makeHandleException } from './handle-exception';

export function onResponse(app: Application) {
  app.use('*', makeHandleNotFound());
  app.use(makeHandleException());
}
