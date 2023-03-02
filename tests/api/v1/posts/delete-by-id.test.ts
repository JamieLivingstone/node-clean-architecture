import { client, seed } from '../..';

describe('DELETE /api/v1/posts/:id', () => {
  describe('given an invalid request', () => {
    test('responds with a 400 status code', async () => {
      const postId = 'invalid';

      const response = await client.delete(`/api/v1/posts/${postId}`);

      expect(response.status).toEqual(400);
    });
  });

  describe('given the post does not exist', () => {
    test('responds with a 404 status code', async () => {
      const postId = 999;

      const response = await client.delete(`/api/v1/posts/${postId}`);

      expect(response.status).toEqual(404);
    });
  });

  describe('given a valid request', () => {
    test('deletes post and responds with a 200 status code', async () => {
      const postId = seed.posts[0].id;

      const createResponse = await client.delete(`/api/v1/posts/${postId}`);
      const getResponse = await client.get(`/api/v1/posts/${postId}`);

      expect(createResponse.status).toEqual(200);
      expect(getResponse.status).toEqual(404);
    });
  });
});
