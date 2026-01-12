import { Visit } from '@domain/entities';
import type { VisitsRepository } from '@domain/repositories';
import type { PrismaClient, Visit as VisitModel } from '@prisma/client';

export function makeVisitsRepository(db: PrismaClient): VisitsRepository {
  return {
    async create(visit) {
      const record = await db.visit.create({
        data: {
          id: visit.id,
          shortenedUrlId: visit.shortenedUrlId,
          referrer: visit.referrer,
        },
      });
      return toEntity(record);
    },
  };
}

function toEntity(record: VisitModel): Visit {
  return new Visit({
    id: record.id,
    shortenedUrlId: record.shortenedUrlId,
    visitedAt: record.visitedAt,
    referrer: record.referrer,
  });
}
