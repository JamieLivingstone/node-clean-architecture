import { makeClient } from '../client';

describe('GET /health', () => {
  it('should respond with a 200 status code', async () => {
    // Arrange
    const { client } = await makeClient();

    // Act
    const response = await client.get('/health');

    // Assert
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});
