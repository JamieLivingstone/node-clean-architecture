import { makeClient } from '../client';

describe('GET /does-not-exist', () => {
  test('responds with a 404 status code', async () => {
    // Arrange
    const { client } = await makeClient();

    // Act
    const response = await client.get('/does-not-exist');

    // Assert
    expect(response.status).toEqual(404);
    expect(response.body).toMatchSnapshot();
  });
});
