export class Post {
  public id?: number;
  public createdAt: Date;
  public published: boolean;
  public title: string;

  constructor(post: { id?: number; createdAt: Date; published: boolean; title: string }) {
    this.id = post.id;
    this.createdAt = post.createdAt;
    this.published = post.published;
    this.title = post.title;
  }
}
