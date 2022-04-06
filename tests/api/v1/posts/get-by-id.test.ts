import { client } from '../../client';
import * as seed from '../../seed';

describe('GET /api/v1/posts/:id', () => {
  describe('given the post does not exist', () => {
    test('responds with a 404 status code', async () => {
      const postId = Number.MAX_SAFE_INTEGER;

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
