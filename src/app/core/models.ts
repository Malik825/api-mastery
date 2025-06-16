export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;

  // Optional properties for UI simulation
  category?: string;
  date?: string;
  readTime?: string;
  image?: string;
}

export interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}