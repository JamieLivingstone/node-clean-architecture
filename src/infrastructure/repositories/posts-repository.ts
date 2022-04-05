import { IPostsRepository } from '@application/common/interfaces';
import { Dependencies } from '@infrastructure/di';
import { Post } from '@domain/entities';

export function makePostsRepository({ db }: Pick<Dependencies, 'db'>): IPostsRepository {
  return {
    async create({ post }) {
      const { id } = await db.post.create({
        data: {
          createdAt: post.createdAt,
          published: post.published,
          title: post.title,
        },
      });

      return {
        id,
      };
    },
    async delete({ postId }) {
      await db.post.delete({ where: { id: postId } });
    },
    async getById({ postId }) {
      const post = await db.post.findFirst({ where: { id: postId } });

      if (!post) {
        return null;
      }

      return new Post({
        id: post.id,
        createdAt: post.createdAt,
        published: post.published,
        title: post.title,
      });
    },
    async update({ post }) {
      await db.post.update({
        where: {
          id: post.id,
        },
        data: {
          createdAt: post.createdAt,
          published: post.published,
          title: post.title,
        },
      });
    },
  };
}
