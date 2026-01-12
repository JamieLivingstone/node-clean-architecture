-- CreateTable
CREATE TABLE "shortened_urls" (
    "id" TEXT NOT NULL,
    "originalUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "shortened_urls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visits" (
    "id" TEXT NOT NULL,
    "shortenedUrlId" TEXT NOT NULL,
    "visitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "referrer" TEXT,

    CONSTRAINT "visits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "visits_shortenedUrlId_visitedAt_idx" ON "visits"("shortenedUrlId", "visitedAt");

-- AddForeignKey
ALTER TABLE "visits" ADD CONSTRAINT "visits_shortenedUrlId_fkey" FOREIGN KEY ("shortenedUrlId") REFERENCES "shortened_urls"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
