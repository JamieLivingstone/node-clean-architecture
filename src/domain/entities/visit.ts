export class Visit {
  readonly id: string;
  readonly shortenedUrlId: string;
  readonly visitedAt: Date;
  readonly referrer: string | null;

  constructor(params: { id: string; shortenedUrlId: string; visitedAt: Date; referrer: string | null }) {
    this.id = params.id;
    this.shortenedUrlId = params.shortenedUrlId;
    this.visitedAt = params.visitedAt;
    this.referrer = params.referrer;
  }
}
