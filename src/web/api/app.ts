import express from 'express';
import helmet from 'helmet';

export function makeApplication() {
  const app = express();

  app.use(helmet());

  app.use(express.json());

  app.use('/health', function healthCheck(_, res) {
    res.json('Healthy');
  });

  return app;
}
