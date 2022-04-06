import { Application } from 'express';
import { makeHandleNotFound } from './handle-not-found';
import { makeHandleException } from './handle-exception';
import { Dependencies } from '@web/crosscutting/container';

export function onResponse({ app, dependencies }: { app: Application; dependencies: Dependencies }) {
  app.use('*', makeHandleNotFound());
  app.use(makeHandleException(dependencies));
}
