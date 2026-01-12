import { randomUUID } from 'node:crypto';
import { Visit } from '@domain/entities';
import type { UseCaseDependencies } from '@infrastructure/di';
import { z } from 'zod';

const paramsSchema = z.object({
  id: z.string().min(1),
  referrer: z.string().nullable().default(null),
});

export type RedirectToUrlParams = z.input<typeof paramsSchema>;
export type RedirectToUrlResult =
  | { type: 'success'; originalUrl: string }
  | { type: 'not_found' }
  | { type: 'expired' };

export async function redirectToUrl(
  params: RedirectToUrlParams,
  { logger, repositories }: UseCaseDependencies,
): Promise<RedirectToUrlResult> {
  const validated = paramsSchema.parse(params);

  logger.info({ id: validated.id }, 'Looking up shortened URL');

  const shortenedUrl = await repositories.shortenedUrlsRepository.getById(validated.id);

  if (!shortenedUrl) {
    logger.info({ id: validated.id }, 'Shortened URL not found');
    return { type: 'not_found' };
  }

  if (shortenedUrl.isExpired()) {
    logger.info({ id: validated.id }, 'Shortened URL has expired');
    return { type: 'expired' };
  }

  const visit = new Visit({
    id: randomUUID(),
    shortenedUrlId: shortenedUrl.id,
    visitedAt: new Date(),
    referrer: validated.referrer,
  });

  try {
    await repositories.visitsRepository.create(visit);
    logger.info({ id: validated.id, visitId: visit.id }, 'Visit recorded');
  } catch (error) {
    logger.error({ id: validated.id, visitId: visit.id, error }, 'Failed to record visit');
  }

  return { type: 'success', originalUrl: shortenedUrl.originalUrl };
}
