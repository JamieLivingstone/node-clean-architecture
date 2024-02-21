import { makeClient } from '../../client';

describe('GET /api/v1/posts/:id', () => {
  describe('given the post does not exist', () => {
    it('should respond with a 404 status code', async () => {
      // Arrange
      const { client } = await makeClient();
      const postId = '00000000-0000-0000-0000-000000000000';

      // Act
      const response = await client.get(`/api/v1/posts/${postId}`);

      // Assert
      expect(response.status).toEqual(404);
    });
  });

  describe('given a valid request', () => {
    it('should respond with a 200 status code', async () => {
      // Arrange
      const { client, seed } = await makeClient();
      const post = seed.posts[0];

      // Act
      const response = await client.get(`/api/v1/posts/${post.id}`);

      // Assert
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        id: post.id,
        title: post.title,
      });
    });
  });
});
