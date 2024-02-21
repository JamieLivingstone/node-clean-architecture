import { makeClient } from '../../client';

describe('GET /api/v1/posts', () => {
  describe('given an invalid request', () => {
    test('responds with a 400 status code', async () => {
      // Arrange
      const { client } = await makeClient();
      const pageSize = 1000; // Cannot exceed 50

      // Act
      const response = await client.get(`/api/v1/posts?pageSize=${pageSize}`);

      // Assert
      expect(response.status).toEqual(400);
    });
  });

  describe('given a valid request', () => {
    it('should respond with a 200 status code', async () => {
      // Arrange
      const { client } = await makeClient();
      const pageNumber = 3;
      const pageSize = 2;

      // Act
      const response = await client.get(`/api/v1/posts?pageNumber=${pageNumber}&pageSize=${pageSize}`);

      // Assert
      expect(response.status).toEqual(200);
    });
  });
});
