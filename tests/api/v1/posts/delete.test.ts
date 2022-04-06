import { client } from '../../client';
import * as seed from '../../seed';

describe('POST /api/v1/posts', () => {
  describe('given an invalid request', () => {
    test('responds with a 400 status code', async () => {
      const postId = 'invalid';

      const response = await client.delete(`/api/v1/posts/${postId}`);

      expect(response.status).toEqual(400);
    });
  });

  describe('given the post does not exist', () => {
    test('responds with a 404 status code', async () => {
      const postId = Number.MAX_SAFE_INTEGER;

      const response = await client.delete(`/api/v1/posts/${postId}`);

      expect(response.status).toEqual(404);
    });
  });

  describe('given a valid request', () => {
    test('responds with a 200 status code', async () => {
      const postId = seed.posts[0].id;

      const response = await client.delete(`/api/v1/posts/${postId}`);

      expect(response.status).toEqual(200);
    });
  });
});
