export class ShortenedUrl {
  readonly id: string;
  readonly originalUrl: string;
  readonly createdAt: Date;
  readonly expiresAt: Date | null;

  constructor(params: { id: string; originalUrl: string; createdAt: Date; expiresAt: Date | null }) {
    this.id = params.id;
    this.originalUrl = params.originalUrl;
    this.createdAt = params.createdAt;
    this.expiresAt = params.expiresAt;
  }

  isExpired(): boolean {
    return this.expiresAt !== null && this.expiresAt < new Date();
  }
}
