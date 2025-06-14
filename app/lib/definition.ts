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
  user_image?: string;
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
  category_id?: number;
  sub_category_id?: number;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
  subcategories_count?: number;
  articles_count?: number;
}

export interface SubCategory {
  id: number;
  category_id: number;
  name: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
  category_name?: string;
  articles_count?: number;
}

export interface Author {
  id: number;
  name: string;
  description?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
  articles_count?: number;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  description?: string;
  image: string | null;
  video: string | null;
  published_at: string;
  category_id: number;
  subcategory_id: number;
  author_id: number;
  category_name?: string;
  subcategory_name?: string;
  author_name?: string;
  tag_names?: string[];
  tag_colors?: string[];
  likes_count?: number;
  comments_count?: number;
  views_count?: number;
}

export type CreateArticleData = Omit<
  Article,
  "id" | "published_at" | "updated_at" | "created_at"
> & {
  tag_ids?: number[];
};

export interface ArticleWithJoins extends Article {
  category?: Category;
  author?: Author;
  user?: User;
  subcategory?: SubCategory;
  tags?: Tag[];
}

export interface Image {
  id: number;
  article_id: number | null;
  image_url: string;
  description: string | null;
  type: "banner" | "video" | "thumbnail" | "gallery";
  entity_type: "advertisement" | "article" | "author" | "category";
  entity_id: number;
  is_featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  article_title?: string;
  article_slug?: string;
}

export interface Video {
  id: number;
  article_id: number;
  video_url?: string;
  description?: string;
  created_at: string;
  updated_at: string;
  article_title?: string;
}

export interface Tag {
  id: number;
  name: string;
  description?: string;
  color?: string;
  category_id?: number;
  sub_category_id?: number;
  created_at: Date;
  updated_at: Date;
  articles_count?: number;
  categories_count?: number;
  subcategories_count?: number;
  category_name?: string;
  sub_category_name?: string;
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

export interface Advertisement {
  id: number;
  sponsor_id: number;
  article_id: number;
  category_id: number;
  ad_type: string;
  ad_content: string;
  start_date: string;
  end_date: string;
  created_at: Date;
  updated_at: Date;
  sponsor_name?: string;
  article_title?: string;
  category_name?: string;
  images?: Image[];
}

export type CreateAdvertisementData = Omit<
  Advertisement,
  "id" | "created_at" | "updated_at"
>;
