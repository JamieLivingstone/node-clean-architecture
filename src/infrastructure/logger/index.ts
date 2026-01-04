import type { ApplicationConfig, Logger } from '@application/common/interfaces';
import pino from 'pino';

export function makeLogger(config: ApplicationConfig): Logger {
  return pino({
    level: config.logLevel,
    enabled: config.env !== 'test',
  });
}
