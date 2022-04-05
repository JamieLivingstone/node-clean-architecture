import express from 'express';
import { Dependencies } from '@web/crosscutting/container';
import * as middlewares from './middlewares';

export function makeApplication(dependencies: Dependencies) {
  const app = express();

  middlewares.onRequest(app, { logger: dependencies.logger });

  middlewares.onResponse(app, { logger: dependencies.logger });

  return app;
}
