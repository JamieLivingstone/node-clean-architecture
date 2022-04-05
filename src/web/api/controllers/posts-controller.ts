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

  return router;
}
