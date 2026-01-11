import { ShortenedUrl } from '@domain/entities';
import type { ShortenedUrlsRepository } from '@domain/repositories';
import { Prisma, type PrismaClient, type ShortenedUrl as ShortenedUrlModel } from '@prisma/client';

export function makeShortenedUrlsRepository(db: PrismaClient): ShortenedUrlsRepository {
  return {
    async create(shortenedUrl) {
      try {
        const record = await db.shortenedUrl.create({
          data: {
            id: shortenedUrl.id,
            originalUrl: shortenedUrl.originalUrl,
            expiresAt: shortenedUrl.expiresAt,
          },
        });
        return { ok: true, data: toEntity(record) };
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
          return { ok: false, error: 'duplicate_id' };
        }
        return { ok: false, error: 'persistence_error' };
      }
    },

    async getById(id) {
      const record = await db.shortenedUrl.findUnique({ where: { id } });
      if (!record) {
        return null;
      }
      return toEntity(record);
    },
  };
}

function toEntity(record: ShortenedUrlModel): ShortenedUrl {
  return new ShortenedUrl({
    id: record.id,
    originalUrl: record.originalUrl,
    createdAt: record.createdAt,
    expiresAt: record.expiresAt,
  });
}
