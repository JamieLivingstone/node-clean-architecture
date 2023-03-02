import { client, seed } from '../..';

describe('GET /api/v1/posts/:id', () => {
  describe('given the post does not exist', () => {
    test('responds with a 404 status code', async () => {
      const postId = 999;

      const response = await client.get(`/api/v1/posts/${postId}`);

      expect(response.status).toEqual(404);
    });
  });

  describe('given a valid request', () => {
    test('responds with a 200 status code', async () => {
      const postId = seed.posts[0].id;

      const response = await client.get(`/api/v1/posts/${postId}`);

      expect(response.status).toEqual(200);
      expect(response.body).toMatchSnapshot();
    });
  });
});
