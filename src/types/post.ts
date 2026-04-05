// types/post.ts

export interface PostBase {
  title: string;
  content: string;
  featuredImage: string;
  status?: "active" | "inactive" | null;
  userId: string;
}

export interface PostWithSlug extends PostBase {
  slug: string;
}

export interface PostRow extends PostBase {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
}