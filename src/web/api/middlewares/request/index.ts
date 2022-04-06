import express, { Application } from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import openapi from '../../openapi.json';

export function onRequest({ app }: { app: Application }) {
  app.use(helmet());
  app.use(express.json());
  app.use('/health', (req, res) => res.status(200).send('OK'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapi));
}
