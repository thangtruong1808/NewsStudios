export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: "admin" | "user" | "editor";
  status: "active" | "inactive";
  description?: string;
  user_image?: string;
  created_at: string;
  updated_at: string;
}

export interface UserFormData {
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  role: "admin" | "user" | "editor";
  status: "active" | "inactive";
  description?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: Omit<User, "password">;
  error?: string;
  token?: string;
}

export interface TagFormData {
  name: string;
  description?: string;
  color?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

export interface SubCategory {
  id: number;
  category_id: number;
  name: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Author {
  id: number;
  name: string;
  description?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  category_id: number;
  user_id: number;
  author_id: number;
  sub_category_id?: number;
  image?: string | null;
  video?: string | null;
  created_at: Date;
  updated_at: Date;
  published_at: Date;
  is_featured: boolean;
  headline_priority: number;
  headline_image_url?: string | null;
  headline_video_url?: string | null;
  is_trending: boolean;
  category_name?: string;
  author_name?: string;
  tag_names?: string[];
  tag_ids?: number[];
}

export type CreateArticleData = Omit<
  Article,
  | "id"
  | "created_at"
  | "updated_at"
  | "category_name"
  | "author_name"
  | "tag_names"
  | "tag_ids"
>;

export interface ArticleWithTags extends Article {
  tags: Tag[];
}

export interface Image {
  id: number;
  article_id: number;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface Video {
  id: number;
  article_id: number;
  video_url?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: number;
  name: string;
  description?: string;
  color?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ArticleTag {
  article_id: number;
  tag_id: number;
  created_at: Date;
}

export interface Comment {
  id: number;
  article_id: number;
  user_id: number;
  content: string;
  created_at: Date;
  updated_at: Date;
}

export interface Like {
  id: number;
  article_id: number;
  user_id: number;
  created_at: Date;
}

export interface Share {
  id: number;
  article_id: number;
  user_id: number;
  platform: string;
  created_at: Date;
}

export interface Bookmark {
  id: number;
  article_id: number;
  user_id: number;
  created_at: Date;
}

export interface Sponsor {
  id: number;
  name: string;
  contact_email?: string;
  contact_phone?: string;
  website_url?: string;
  image_url?: string;
  video_url?: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Advertisement {
  id: number;
  sponsor_id: number;
  article_id: number;
  category_id: number;
  start_date: string;
  end_date: string;
  ad_type: string;
  ad_content: string;
  image_url?: string;
  video_url?: string;
  created_at: string;
  updated_at: string;
}
