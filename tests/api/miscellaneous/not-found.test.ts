import { client } from '../client';

describe('GET /does-not-exist', () => {
  test('responds with a 404 status code', async () => {
    const response = await client.get('/does-not-exist');

    expect(response.status).toEqual(404);
    expect(response.body).toMatchSnapshot();
  });
});
