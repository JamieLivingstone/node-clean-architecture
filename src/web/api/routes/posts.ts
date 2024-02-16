import { FastifyInstance } from 'fastify';
import { makePostsUseCases } from '@application/posts';
import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';

export default async function postRoutes(fastify: FastifyInstance) {
  const posts = makePostsUseCases(fastify.diContainer.cradle);
  const server = fastify.withTypeProvider<JsonSchemaToTsProvider>();

  // GET /api/v1/posts/:id - Get an individual post by id
  server.route({
    method: 'GET',
    url: '/api/v1/posts/:id',
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'number' },
        },
        required: ['id'],
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            published: { type: 'boolean' },
            title: { type: 'string' },
          },
        },
      },
    },
    async handler(req, res) {
      const post = await posts.queries.getPost({ id: req.params.id });

      if (!post) {
        res.status(404).send({ message: 'Post not found' });
        return;
      }

      res.status(200).send(post);
    },
  });
}
