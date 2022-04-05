import { client } from '../../client';
import { CreatePostCommand } from '@application/posts/commands/create-post';

describe('POST /api/v1/posts', () => {
  describe('given an invalid request', () => {
    test('responds with a 400 status code', async () => {
      const payload: CreatePostCommand = {
        published: true,
        title: '', // Cannot be empty
      };

      const response = await client.post('/api/v1/posts').send(payload);

      expect(response.status).toEqual(400);
    });
  });

  describe('given a valid request', () => {
    test('responds with a 201 status code', async () => {
      const payload: CreatePostCommand = {
        published: true,
        title: 'Example post',
      };

      const response = await client.post('/api/v1/posts').send(payload);

      expect(response.status).toEqual(201);
      expect(response.body).toMatchSnapshot({ id: expect.any(Number) });
    });
  });
});
