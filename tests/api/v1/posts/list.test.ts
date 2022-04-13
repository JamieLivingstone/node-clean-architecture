import { client } from '../..';

describe('GET /api/v1/posts', () => {
  describe('given an invalid request', () => {
    test('responds with a 400 status code', async () => {
      const pageSize = 1000; // Cannot exceed 50

      const response = await client.get(`/api/v1/posts?pageSize=${pageSize}`);

      expect(response.status).toEqual(400);
    });
  });

  describe('given a valid request', () => {
    test('responds with a 200 status code', async () => {
      const pageNumber = 3;
      const pageSize = 2;

      const response = await client.get(`/api/v1/posts?pageNumber=${pageNumber}&pageSize=${pageSize}`);

      expect(response.status).toEqual(200);
      expect(response.body).toMatchSnapshot();
    });
  });
});
