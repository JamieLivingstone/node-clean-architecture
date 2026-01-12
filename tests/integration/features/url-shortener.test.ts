import { type Agent, closeTestServer, getTestClient } from '../helpers/fastify';

describe('URL Shortener API', () => {
  let client: Agent;

  beforeAll(async () => {
    client = await getTestClient();
  });

  afterAll(async () => {
    await closeTestServer();
  });

  describe('POST /api/v1/shorten', () => {
    it('should create a shortened URL', async () => {
      const response = await client.post('/api/v1/shorten').send({ url: 'https://example.com' });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ id: expect.any(String) });
    });

    it('should create a shortened URL with expiration date', async () => {
      const futureDate = new Date(Date.now() + 86400000).toISOString();

      const response = await client.post('/api/v1/shorten').send({
        url: 'https://example.com/path',
        expiresAt: futureDate,
      });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ id: expect.any(String) });
    });

    it('should return 400 for invalid URL', async () => {
      const response = await client.post('/api/v1/shorten').send({ url: 'not-a-url' });

      expect(response.status).toBe(400);
    });

    it('should return 400 for disallowed protocol', async () => {
      const response = await client.post('/api/v1/shorten').send({ url: 'javascript:alert(1)' });

      expect(response.status).toBe(400);
    });

    it('should return 400 for past expiration date', async () => {
      const pastDate = new Date(Date.now() - 86400000).toISOString();

      const response = await client.post('/api/v1/shorten').send({
        url: 'https://example.com',
        expiresAt: pastDate,
      });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /r/:id', () => {
    it('should redirect to original URL with 302', async () => {
      const createResponse = await client.post('/api/v1/shorten').send({ url: 'https://example.com/target' });
      const { id } = createResponse.body;

      const response = await client.get(`/r/${id}`).redirects(0);

      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('https://example.com/target');
    });

    it('should return 404 for non-existent URL', async () => {
      const response = await client.get('/r/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Shortened URL not found', statusCode: 404 });
    });

    it('should return 410 for expired URL', async () => {
      const pastDate = new Date(Date.now() + 100).toISOString();
      const createResponse = await client.post('/api/v1/shorten').send({
        url: 'https://example.com/expired',
        expiresAt: pastDate,
      });
      const { id } = createResponse.body;

      await new Promise((resolve) => setTimeout(resolve, 150));

      const response = await client.get(`/r/${id}`);

      expect(response.status).toBe(410);
      expect(response.body).toEqual({ message: 'Shortened URL has expired', statusCode: 410 });
    });
  });
});
