import pino from 'pino';
import type { ApplicationConfig } from '../config';

export function makeLogger(config: ApplicationConfig) {
  return pino({
    level: config.logLevel,
    enabled: config.loggerEnabled,
  });
}
