import { Post as PostModel } from '@prisma/client';
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
    async delete({ id }) {
      await db.post.delete({ where: { id } });
    },
    async getById({ id }) {
      const post = await db.post.findFirst({ where: { id } });

      if (!post) {
        return null;
      }

      return toEntity(post);
    },
    async list({ pageNumber, pageSize }) {
      const count = await db.post.count();

      const posts = await db.post.findMany({
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
      });

      return {
        count,
        posts: posts.map(toEntity),
      };
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

  function toEntity(post: PostModel) {
    return new Post({
      id: post.id,
      createdAt: post.createdAt,
      published: post.published,
      title: post.title,
    });
  }
}
