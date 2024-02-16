import { makeClient } from '../../client';
import { seedPosts } from '../../seed';

describe('GET /api/v1/posts/:id', () => {
  describe('given the post does not exist', () => {
    test('responds with a 404 status code', async () => {
      // Arrange
      const client = await makeClient();
      const postId = 999;

      // Act
      const response = await client.get(`/api/v1/posts/${postId}`);

      // Assert
      expect(response.status).toEqual(404);
    });
  });

  describe('given a valid request', () => {
    test('responds with a 200 status code', async () => {
      // Arrange
      const client = await makeClient();
      const postId = seedPosts[0].id;

      // Act
      const response = await client.get(`/api/v1/posts/${postId}`);

      // Assert
      expect(response.status).toEqual(200);
      expect(response.body).toMatchSnapshot();
    });
  });
});
