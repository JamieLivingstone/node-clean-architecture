import express, { Application } from 'express';
import helmet from 'helmet';
import { Dependencies } from '@web/crosscutting/container';

export function onRequest(app: Application, { logger }: Pick<Dependencies, 'logger'>) {
  app.use(helmet());
  app.use(express.json());
  app.use('/health', (req, res) => res.status(200).send('OK'));
}
