export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  category_id: string | null;
  author_id?: string | null;
  author_name?: string;
  published: boolean;
  views?: number;
  reading_time?: string;
  created_at: string;
  updated_at: string;
  categories?: Category | null;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  bio: string;
  avatar_url: string;
  website?: string;
  github?: string;
  twitter?: string;
}

export interface Comment {
  id: string;
  post_id: string;
  author_name: string;
  content: string;
  created_at: string;
}
