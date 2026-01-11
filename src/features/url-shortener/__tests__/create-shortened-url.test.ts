import type { Dependencies } from '@infrastructure/di';
import { type DeepMockProxy, mockDeep } from 'vitest-mock-extended';
import { createShortenedUrl } from '../create-shortened-url';

describe('createShortenedUrl', () => {
  let dependencies: DeepMockProxy<Dependencies>;

  beforeEach(() => {
    dependencies = mockDeep<Dependencies>();
    dependencies.repositories.shortenedUrlsRepository.create.mockImplementation((entity) =>
      Promise.resolve({ ok: true, data: entity }),
    );
  });

  it('should return success with 10-char alphanumeric id', async () => {
    const result = await createShortenedUrl({ url: 'https://example.com' }, dependencies);

    expect(result).toEqual({ type: 'success', id: expect.stringMatching(/^[A-Za-z0-9]{10}$/) });
  });

  it('should persist shortened url with correct fields', async () => {
    const futureDate = new Date(Date.now() + 86400000);

    await createShortenedUrl({ url: 'https://example.com/path', expiresAt: futureDate.toISOString() }, dependencies);

    expect(dependencies.repositories.shortenedUrlsRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.any(String),
        originalUrl: 'https://example.com/path',
        expiresAt: futureDate,
      }),
    );
  });

  it('should reject past expiration date', async () => {
    const pastDate = new Date(Date.now() - 86400000);

    await expect(
      createShortenedUrl({ url: 'https://example.com', expiresAt: pastDate.toISOString() }, dependencies),
    ).rejects.toMatchObject({
      issues: [{ message: 'Must be in the future', path: ['expiresAt'] }],
    });
  });

  it('should reject invalid date format', async () => {
    await expect(
      createShortenedUrl({ url: 'https://example.com', expiresAt: 'not-a-date' }, dependencies),
    ).rejects.toMatchObject({
      issues: [{ code: 'invalid_type', path: ['expiresAt'] }],
    });
  });

  it('should reject invalid URLs', async () => {
    await expect(createShortenedUrl({ url: 'not-a-valid-url' }, dependencies)).rejects.toMatchObject({
      issues: [{ message: 'Invalid URL. Must be a valid http or https URL.', path: ['url'] }],
    });

    await expect(createShortenedUrl({ url: 'ftp://example.com' }, dependencies)).rejects.toMatchObject({
      issues: [{ message: 'Invalid URL. Must be a valid http or https URL.', path: ['url'] }],
    });
  });

  it('should accept http:// URLs', async () => {
    const result = await createShortenedUrl({ url: 'http://example.com' }, dependencies);

    expect(result).toEqual({ type: 'success', id: expect.any(String) });
  });

  it('should accept URL at max length (2048 characters)', async () => {
    const longPath = 'a'.repeat(2048 - 'https://example.com/'.length);
    const maxLengthUrl = `https://example.com/${longPath}`;

    const result = await createShortenedUrl({ url: maxLengthUrl }, dependencies);

    expect(result).toEqual({ type: 'success', id: expect.any(String) });
  });

  it('should reject URL exceeding max length', async () => {
    const longPath = 'a'.repeat(2049 - 'https://example.com/'.length);
    const tooLongUrl = `https://example.com/${longPath}`;

    await expect(createShortenedUrl({ url: tooLongUrl }, dependencies)).rejects.toMatchObject({
      issues: [{ path: ['url'] }],
    });
  });

  it('should normalise IDN domains to punycode to prevent homograph attacks', async () => {
    await createShortenedUrl({ url: 'https://例え.jp/パス' }, dependencies);

    expect(dependencies.repositories.shortenedUrlsRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        originalUrl: 'https://xn--r8jz45g.jp/%E3%83%91%E3%82%B9',
      }),
    );
  });

  it('should normalise URLs with Cyrillic lookalike characters', async () => {
    // Cyrillic 'а' (U+0430) looks identical to Latin 'a' (U+0061)
    await createShortenedUrl({ url: 'https://аpple.com' }, dependencies);

    expect(dependencies.repositories.shortenedUrlsRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        originalUrl: 'https://xn--pple-43d.com/',
      }),
    );
  });

  it('should normalise URL by adding trailing slash to bare domains', async () => {
    await createShortenedUrl({ url: 'https://example.com' }, dependencies);

    expect(dependencies.repositories.shortenedUrlsRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        originalUrl: 'https://example.com/',
      }),
    );
  });

  it('should accept URLs with authentication credentials', async () => {
    const result = await createShortenedUrl({ url: 'https://user:pass@example.com/path' }, dependencies);

    expect(result).toEqual({ type: 'success', id: expect.any(String) });
  });

  it('should retry on ID collision', async () => {
    let callCount = 0;
    dependencies.repositories.shortenedUrlsRepository.create.mockImplementation((entity) => {
      callCount++;
      if (callCount === 1) {
        return Promise.resolve({ ok: false, error: 'duplicate_id' });
      }
      return Promise.resolve({ ok: true, data: entity });
    });

    const result = await createShortenedUrl({ url: 'https://example.com' }, dependencies);

    expect(result).toEqual({ type: 'success', id: expect.any(String) });
    expect(callCount).toBe(2);
  });

  it('should return id_collision after max retries', async () => {
    dependencies.repositories.shortenedUrlsRepository.create.mockResolvedValue({
      ok: false,
      error: 'duplicate_id',
    });

    const result = await createShortenedUrl({ url: 'https://example.com' }, dependencies);

    expect(result).toEqual({ type: 'id_collision' });
    expect(dependencies.repositories.shortenedUrlsRepository.create).toHaveBeenCalledTimes(3);
  });

  it('should return error on persistence failure', async () => {
    dependencies.repositories.shortenedUrlsRepository.create.mockResolvedValue({
      ok: false,
      error: 'persistence_error',
    });

    const result = await createShortenedUrl({ url: 'https://example.com' }, dependencies);

    expect(result).toEqual({ type: 'error' });
    expect(dependencies.repositories.shortenedUrlsRepository.create).toHaveBeenCalledTimes(1);
  });
});
