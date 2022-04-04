import { Post } from '@domain/entities';

export interface IPostsRepository {
  create(parameters: { post: Post }): Promise<{ id: number }>;
  delete(parameters: { postId: number }): Promise<void>;
  getById(parameters: { postId: number }): Promise<Post | null>;
  update(parameters: { post: Post }): Promise<void>;
}
