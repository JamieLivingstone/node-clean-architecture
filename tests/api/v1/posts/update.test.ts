import { makeClient } from '../../client';
import { seedPosts } from '../../seed';

describe('PATCH /api/v1/posts/:id', () => {
  describe('given an invalid request', () => {
    test('responds with a 400 status code', async () => {
      // Arrange
      const client = await makeClient();
      const postId = seedPosts[0].id;

      // Act
      const response = await client.patch(`/api/v1/posts/${postId}`).send({
        published: 'false', // Must be a boolean
      });

      // Assert
      expect(response.status).toEqual(400);
    });
  });

  describe('given the post does not exist', () => {
    test('responds with a 404 status code', async () => {
      // Arrange
      const client = await makeClient();
      const postId = 999;

      // Act
      const response = await client.patch(`/api/v1/posts/${postId}`).send({
        published: false,
      });

      // Assert
      expect(response.status).toEqual(404);
    });
  });

  describe('given a valid request', () => {
    test('updates post and responds with a 200 status code', async () => {
      // Arrange
      const client = await makeClient();
      const post = seedPosts[0];

      // Act
      const updateResponse = await client.patch(`/api/v1/posts/${post.id}`).send({
        published: !post.published,
        title: 'Updated title',
      });

      const getResponse = await client.get(`/api/v1/posts/${post.id}`);

      // Assert
      expect(updateResponse.status).toEqual(200);
      expect(getResponse.status).toEqual(200);
      expect(getResponse.body).toMatchSnapshot();
    });
  });
});
