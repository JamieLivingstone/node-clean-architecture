import { makeClient } from '../../client';

describe('DELETE /api/v1/posts/:id', () => {
  describe('given an invalid request', () => {
    it('should respond with a 400 status code', async () => {
      // Arrange
      const { client } = await makeClient();
      const postId = 'invalid_uuid';

      // Act
      const response = await client.delete(`/api/v1/posts/${postId}`);

      // Assert
      expect(response.status).toEqual(400);
    });
  });

  describe('given a valid request', () => {
    it('should delete post and respond with a 200 status code', async () => {
      // Arrange
      const { client, seed } = await makeClient();
      const postId = seed.posts[0].id;

      // Act
      const createResponse = await client.delete(`/api/v1/posts/${postId}`);
      const getResponse = await client.get(`/api/v1/posts/${postId}`);

      // Assert
      expect(createResponse.status).toEqual(200);
      expect(getResponse.status).toEqual(404);
    });
  });
});
