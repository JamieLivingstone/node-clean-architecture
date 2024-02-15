import { Logger } from '@application/common/interfaces';
import pino from 'pino';

export function makeLogger(): Logger {
  return pino({
    level: 'info',
    enabled: process.env.NODE_ENV !== 'test',
  });
}
