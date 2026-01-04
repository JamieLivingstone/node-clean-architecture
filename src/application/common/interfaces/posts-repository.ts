import type { Post } from '@domain/entities';

export interface PostsRepository {
  create(parameters: { post: Post }): Promise<{ id: string }>;
  delete(parameters: { id: string }): Promise<void>;
  getById(parameters: { id: string }): Promise<Post | null>;
  list(parameters: { pageNumber: number; pageSize: number }): Promise<{ count: number; posts: Array<Post> }>;
}
