import { ShortenedUrl } from '@domain/entities';
import type { Dependencies } from '@infrastructure/di';
import { type DeepMockProxy, mockDeep } from 'vitest-mock-extended';
import { redirectToUrl } from '../redirect-to-url';

describe('redirectToUrl', () => {
  let dependencies: DeepMockProxy<Dependencies>;

  const validShortenedUrl = new ShortenedUrl({
    id: 'abc123XYZ0',
    originalUrl: 'https://example.com/original',
    createdAt: new Date(),
    expiresAt: null,
  });

  beforeEach(() => {
    dependencies = mockDeep<Dependencies>();
    dependencies.repositories.shortenedUrlsRepository.getById.mockResolvedValue(validShortenedUrl);
    dependencies.repositories.visitsRepository.create.mockImplementation((visit) => Promise.resolve(visit));
  });

  it('should return success with original URL', async () => {
    const result = await redirectToUrl({ id: 'abc123XYZ0' }, dependencies);

    expect(result).toEqual({ type: 'success', originalUrl: 'https://example.com/original' });
  });

  it('should record visit with referrer', async () => {
    await redirectToUrl({ id: 'abc123XYZ0', referrer: 'https://google.com' }, dependencies);

    expect(dependencies.repositories.visitsRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        shortenedUrlId: 'abc123XYZ0',
        referrer: 'https://google.com',
        visitedAt: expect.any(Date),
      }),
    );
  });

  it('should record visit with null referrer when not provided', async () => {
    await redirectToUrl({ id: 'abc123XYZ0' }, dependencies);

    expect(dependencies.repositories.visitsRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        shortenedUrlId: 'abc123XYZ0',
        referrer: null,
      }),
    );
  });

  it('should return not_found when URL does not exist', async () => {
    dependencies.repositories.shortenedUrlsRepository.getById.mockResolvedValue(null);

    const result = await redirectToUrl({ id: 'nonexistent' }, dependencies);

    expect(result).toEqual({ type: 'not_found' });
    expect(dependencies.repositories.visitsRepository.create).not.toHaveBeenCalled();
  });

  it('should return expired when URL has expired', async () => {
    const expiredUrl = new ShortenedUrl({
      id: 'expired123',
      originalUrl: 'https://example.com/expired',
      createdAt: new Date(Date.now() - 86400000 * 2),
      expiresAt: new Date(Date.now() - 86400000),
    });
    dependencies.repositories.shortenedUrlsRepository.getById.mockResolvedValue(expiredUrl);

    const result = await redirectToUrl({ id: 'expired123' }, dependencies);

    expect(result).toEqual({ type: 'expired' });
    expect(dependencies.repositories.visitsRepository.create).not.toHaveBeenCalled();
  });

  it('should return success when URL has future expiration', async () => {
    const futureExpirationUrl = new ShortenedUrl({
      id: 'future123',
      originalUrl: 'https://example.com/future',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 86400000),
    });
    dependencies.repositories.shortenedUrlsRepository.getById.mockResolvedValue(futureExpirationUrl);

    const result = await redirectToUrl({ id: 'future123' }, dependencies);

    expect(result).toEqual({ type: 'success', originalUrl: 'https://example.com/future' });
    expect(dependencies.repositories.visitsRepository.create).toHaveBeenCalled();
  });

  it('should reject empty id', async () => {
    await expect(redirectToUrl({ id: '' }, dependencies)).rejects.toMatchObject({
      issues: [{ path: ['id'] }],
    });
  });
});
