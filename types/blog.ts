// Type definitions for our blog data

// Post type
export interface Post {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image: string;
  published_at: string | null;
  is_published: boolean;
  author_id: string;
  category_id: string;
  read_time: string;
  author?: Author;
  category?: Category;
}

// Author type
export interface Author {
  id: string;
  created_at: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
}

// Category type
export interface Category {
  id: string;
  created_at: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

// For the frontend, we might want simplified versions of these types
export interface PostSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string;
  published_at: string | null;
  read_time: string;
  author: {
    name: string;
    avatar: string;
  };
  category: string;
}

// For the featured post
export interface FeaturedPost extends PostSummary {
  isFeatured: boolean;
}

// For category cards
export interface CategoryCard {
  name: string;
  slug: string;
  description: string;
  image: string;
  postCount?: number;
}
