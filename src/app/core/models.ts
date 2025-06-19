// post.model.ts
export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
  category?: string;
  date?: string;
  readTime?: string;
  image?: string;
}

// comment.model.ts
export interface PostComment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}
