import type { ApplicationConfig } from '@application/common/interfaces';
import { z } from 'zod';

export function makeConfig(): ApplicationConfig {
  const schema = z.object({
    DATABASE_URL: z.string(),
    NODE_ENV: z.union([z.literal('development'), z.literal('production'), z.literal('test')]),
    LOG_LEVEL: z.union([z.literal('debug'), z.literal('info'), z.literal('warn'), z.literal('error')]),
    PORT: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => val >= 1 && val <= 65535, {
        message: 'Port must be between 1 and 65535',
      }),
  });

  const parsedEnv = schema.parse(process.env);

  return {
    env: parsedEnv.NODE_ENV,
    logLevel: parsedEnv.LOG_LEVEL,
    port: parsedEnv.PORT,
  };
}
