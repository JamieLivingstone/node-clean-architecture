import { Post } from '@domain/entities';

export function toDto(post: Post) {
  return {
    id: post.id,
    title: post.title,
  };
}
