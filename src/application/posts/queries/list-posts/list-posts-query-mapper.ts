import { Post } from '@domain/entities';

export function toDto({
  count,
  pageNumber,
  pageSize,
  posts,
}: {
  count: number;
  pageNumber: number;
  pageSize: number;
  posts: Array<Post>;
}) {
  const totalPages = Math.ceil(count / pageSize);

  return {
    count,
    hasPreviousPage: pageNumber > 1,
    hasNextPage: pageNumber < totalPages,
    pageNumber,
    pageSize,
    posts: posts.map((post) => ({
      id: post.id,
      title: post.title,
    })),
    totalPages,
  };
}
