import { ShortenedUrl } from '@domain/entities';
import type { UseCaseDependencies } from '@infrastructure/di';
import { customAlphabet } from 'nanoid';
import { z } from 'zod';

const generateId = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 10);

const paramsSchema = z.object({
  url: z
    .string()
    .max(2048)
    .transform((url, ctx) => {
      try {
        const parsed = new URL(url);
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
          ctx.addIssue({ code: 'custom', message: 'Invalid URL. Must be a valid http or https URL.' });
          return z.NEVER;
        }
        // Return normalised href - converts IDN domains to punycode to prevent homograph attacks
        return parsed.href;
      } catch {
        ctx.addIssue({ code: 'custom', message: 'Invalid URL. Must be a valid http or https URL.' });
        return z.NEVER;
      }
    }),
  expiresAt: z.coerce
    .date()
    .refine((d) => d > new Date(), { message: 'Must be in the future' })
    .nullable()
    .default(null),
});

export type CreateShortenedUrlParams = z.input<typeof paramsSchema>;
export type CreateShortenedUrlResult = { type: 'success'; id: string } | { type: 'id_collision' } | { type: 'error' };

const MAX_RETRIES = 3;

export async function createShortenedUrl(
  params: CreateShortenedUrlParams,
  { logger, repositories }: UseCaseDependencies,
): Promise<CreateShortenedUrlResult> {
  logger.info('Creating shortened URL');

  const validated = paramsSchema.parse(params);

  for (let attempt = 1; ; attempt++) {
    const shortenedUrl = new ShortenedUrl({
      id: generateId(),
      originalUrl: validated.url,
      createdAt: new Date(),
      expiresAt: validated.expiresAt,
    });

    const result = await repositories.shortenedUrlsRepository.create(shortenedUrl);

    if (result.ok) {
      logger.info({ id: result.data.id }, 'Shortened URL created');
      return { type: 'success', id: result.data.id };
    }

    if (result.error === 'persistence_error') {
      logger.error('Failed to create shortened URL');
      return { type: 'error' };
    }

    if (attempt >= MAX_RETRIES) {
      logger.error('ID collision after max retries');
      return { type: 'id_collision' };
    }

    logger.warn({ attempt }, 'ID collision, retrying');
  }
}
