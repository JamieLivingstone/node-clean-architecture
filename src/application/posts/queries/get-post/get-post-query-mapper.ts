import { Post } from '@domain/entities';

export function toDto(post: Post) {
  return {
    id: post.id as number,
    published: post.published,
    title: post.title,
  };
}
