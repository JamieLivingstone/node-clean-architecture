import { type Agent, closeTestServer, getTestClient } from '../helpers/fastify';

describe('Error Handler Plugin', () => {
  let client: Agent;

  beforeAll(async () => {
    client = await getTestClient();
  });

  afterAll(async () => {
    await closeTestServer();
  });

  it('should return 404 for unknown routes', async () => {
    const response = await client.get('/non-existent-route');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Not found', statusCode: 404 });
  });
});
