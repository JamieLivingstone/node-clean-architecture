import { makeClient } from '../../client';

describe('POST /api/v1/posts', () => {
  describe('given an invalid request', () => {
    test('responds with a 400 status code', async () => {
      // Arrange
      const client = await makeClient();

      // Act
      const response = await client.post('/api/v1/posts').send({
        published: true,
        title: '', // Cannot be empty
      });

      // Assert
      expect(response.status).toEqual(400);
    });
  });

  describe('given a valid request', () => {
    test('creates post and responds with a 201 status code', async () => {
      // Arrange
      const client = await makeClient();

      // Act
      const createResponse = await client.post('/api/v1/posts').send({
        published: true,
        title: 'Example post',
      });

      const getResponse = await client.get(`/api/v1/posts/${createResponse.body.id}`);

      // Assert
      expect(createResponse.status).toEqual(201);
      expect(createResponse.body).toMatchSnapshot({ id: expect.any(Number) });
      expect(getResponse.status).toEqual(200);
    });
  });
});
