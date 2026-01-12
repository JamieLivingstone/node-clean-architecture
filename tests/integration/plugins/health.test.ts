import { type Agent, closeTestServer, getTestClient } from '../helpers/fastify';

describe('Health Endpoints', () => {
  let client: Agent;

  beforeAll(async () => {
    client = await getTestClient();
  });

  afterAll(async () => {
    await closeTestServer();
  });

  describe('GET /health', () => {
    it('should return ok status', async () => {
      const response = await client.get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });

  describe('GET /ready', () => {
    it('should return ok status when database is connected', async () => {
      const response = await client.get('/ready');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });
});
