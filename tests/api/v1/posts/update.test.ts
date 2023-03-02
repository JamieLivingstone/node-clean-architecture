import { client, seed } from '../..';

describe('PATCH /api/v1/posts/:id', () => {
  describe('given an invalid request', () => {
    test('responds with a 400 status code', async () => {
      const postId = seed.posts[0].id;

      const response = await client.patch(`/api/v1/posts/${postId}`).send({
        published: 'false', // Must be a boolean
      });

      expect(response.status).toEqual(400);
    });
  });

  describe('given the post does not exist', () => {
    test('responds with a 404 status code', async () => {
      const postId = 999;

      const response = await client.patch(`/api/v1/posts/${postId}`).send({
        published: false,
      });

      expect(response.status).toEqual(404);
    });
  });

  describe('given a valid request', () => {
    test('updates post and responds with a 200 status code', async () => {
      const post = seed.posts[0];

      const updateResponse = await client.patch(`/api/v1/posts/${post.id}`).send({
        published: !post.published,
        title: 'Updated title',
      });

      const getResponse = await client.get(`/api/v1/posts/${post.id}`);

      expect(updateResponse.status).toEqual(200);
      expect(getResponse.status).toEqual(200);
      expect(getResponse.body).toMatchSnapshot();
    });
  });
});
