import winston from 'winston';
import { ILogger } from '@application/common/interfaces';

export function makeLogger(): ILogger {
  return winston.createLogger({
    format: winston.format.json(),
    level: 'info',
    transports: [
      new winston.transports.Console({
        format: winston.format.json(),
        level: 'info',
        silent: process.env.NODE_ENV === 'test',
      }),
    ],
  });
}
