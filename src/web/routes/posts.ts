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
          title: { type: 'string' },
        },
        required: ['title'],
      },
      response: {
        201: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
        },
      },
      400: { $ref: 'ExceptionResponse#' },
      tags: ['posts'],
    },
    async handler(req, res) {
      const post = await posts.commands.createPost(req.body);

      res.status(201).send(post);
    },
  });

  fastify.route({
    method: 'DELETE',
    url: '/api/v1/posts/:id',
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
        required: ['id'],
      },
      response: {
        200: {},
        400: { $ref: 'ExceptionResponse#' },
      },
      tags: ['posts'],
    },
    async handler(req, res) {
      await posts.commands.deletePost({ id: req.params.id });

      res.status(200).send({});
    },
  });

  fastify.route({
    method: 'GET',
    url: '/api/v1/posts/:id',
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
        required: ['id'],
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
          },
        },
        400: { $ref: 'ExceptionResponse#' },
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

  fastify.route({
    method: 'GET',
    url: '/api/v1/posts',
    schema: {
      querystring: {
        type: 'object',
        properties: {
          pageNumber: { type: 'integer' },
          pageSize: { type: 'integer' },
        },
        required: ['pageNumber', 'pageSize'],
      },
      response: {
        200: {
          type: 'object',
          properties: {
            count: { type: 'integer' },
            hasPreviousPage: { type: 'boolean' },
            hasNextPage: { type: 'boolean' },
            pageNumber: { type: 'integer' },
            pageSize: { type: 'integer' },
            posts: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  title: { type: 'string' },
                },
              },
            },
            totalPages: { type: 'integer' },
          },
        },
        400: { $ref: 'ExceptionResponse#' },
      },
      tags: ['posts'],
    },
    async handler(req, res) {
      const postList = await posts.queries.listPosts({
        pageNumber: req.query.pageNumber,
        pageSize: req.query.pageSize,
      });

      res.status(200).send(postList);
    },
  });
}
