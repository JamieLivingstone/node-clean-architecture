import { Post as PostModel } from '@prisma/client';
import { PostsRepository } from '@application/common/interfaces';
import { Post } from '@domain/entities';

export function makePostsRepository({ db }: Dependencies): PostsRepository {
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
