import type { ShortenedUrl } from '../entities';

type CreateResult = { ok: true; data: ShortenedUrl } | { ok: false; error: 'duplicate_id' | 'persistence_error' };

export interface ShortenedUrlsRepository {
  create(shortenedUrl: ShortenedUrl): Promise<CreateResult>;
  getById(id: string): Promise<ShortenedUrl | null>;
}
