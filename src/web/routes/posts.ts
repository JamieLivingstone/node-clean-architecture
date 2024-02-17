import { makePostsUseCases } from '@application/posts';

export default async function postRoutes(fastify: FastifyRouteInstance) {
  const posts = makePostsUseCases(fastify.diContainer.cradle);

  fastify.route({
    method: 'POST',
    url: '/api/v1/posts',
    schema: {
      body: {
        type: 'object',
        properties: {
          published: { type: 'boolean' },
          title: { type: 'string' },
        },
        required: ['published', 'title'],
      },
      response: {
        201: {
          type: 'object',
          properties: {
            id: { type: 'number' },
          },
        },
        400: {},
      },
      tags: ['posts'],
    },
    async handler(req, res) {
      const post = await posts.commands.createPost(req.body);

      res.status(201).send(post);
    },
  });

  fastify.route({
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
        404: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
      tags: ['posts'],
    },
    async handler(req, res) {
      const post = await posts.queries.getPost({ id: req.params.id });

      if (!post) {
        res.status(404).send({ message: `Post with id ${req.params.id} not found` });
        return;
      }

      res.status(200).send(post);
    },
  });
}
