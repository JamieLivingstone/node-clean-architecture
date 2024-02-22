export class Post {
  public id?: string;
  public createdAt: Date;
  public title: string;

  constructor(post: { id?: string; createdAt: Date; title: string }) {
    this.id = post.id;
    this.createdAt = post.createdAt;
    this.title = post.title;
  }
}
