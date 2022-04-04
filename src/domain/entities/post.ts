export class Post {
  public id?: number;
  public createdAt: Date;
  public title: string;
  public published: boolean;

  constructor(post: { id?: number; createdAt: Date; title: string; published: boolean }) {
    this.id = post.id;
    this.createdAt = post.createdAt;
    this.title = post.title;
    this.published = post.published;
  }
}
