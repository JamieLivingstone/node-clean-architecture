import { client } from '../client';

describe('GET /health', () => {
  test('responds with a 200 status code', async () => {
    const response = await client.get('/health');

    expect(response.status).toEqual(200);
    expect(response.text).toEqual('OK');
  });
});
