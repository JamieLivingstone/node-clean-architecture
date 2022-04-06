import { Post } from '@domain/entities';

export interface IPostsRepository {
  create(parameters: { post: Post }): Promise<{ id: number }>;
  delete(parameters: { id: number }): Promise<void>;
  getById(parameters: { id: number }): Promise<Post | null>;
  update(parameters: { post: Post }): Promise<void>;
}
