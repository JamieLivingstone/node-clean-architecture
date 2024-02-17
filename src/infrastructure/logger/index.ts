import { Logger } from '@application/common/interfaces';
import pino from 'pino';

export function makeLogger(): Logger {
  return pino({
    level: process.env.LOG_LEVEL,
    enabled: process.env.NODE_ENV !== 'test',
  });
}
