import { IRouter } from 'express';
import { Dependencies } from '@web/crosscutting/container';

export function postsController({ dependencies, router }: { dependencies: Dependencies; router: IRouter }) {
  router.post('/api/v1/posts', async function createPost(request, response, next) {
    try {
      const result = await dependencies.posts.commands.createPost(request.body);

      return response.status(201).json(result);
    } catch (error) {
      return next(error);
    }
  });

  router.delete('/api/v1/posts/:id', async function deletePost(request, response, next) {
    try {
      await dependencies.posts.commands.deletePost({ id: Number(request.params.id) });

      return response.status(200).json({});
    } catch (error) {
      return next(error);
    }
  });

  router.get('/api/v1/posts/:id', async function getPost(request, response, next) {
    try {
      const result = await dependencies.posts.queries.getPost({ id: Number(request.params.id) });

      return response.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  });

  router.patch('/api/v1/posts/:id', async function updatePost(request, response, next) {
    try {
      await dependencies.posts.commands.updatePost({
        id: Number(request.params.id),
        ...request.body,
      });

      return response.status(200).json({});
    } catch (error) {
      return next(error);
    }
  });

  return router;
}
