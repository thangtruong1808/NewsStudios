export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  role: "admin" | "user" | "editor";
  status: "active" | "inactive";
  description?: string;
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

export interface Category {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface CategoryFormData {
  name: string;
  description?: string;
}

export interface Subcategory {
  id: number;
  category_id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface SubcategoryFormData {
  category_id: number;
  name: string;
  description?: string;
}

export interface Author {
  id: number;
  name: string;
  description?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthorFormData {
  name: string;
  description?: string;
  bio?: string;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  category_id: number;
  sub_category_id?: number;
  author_id: number;
  image?: string;
  video?: string;
  published_at?: string;
  updated_at: string;
  is_featured: boolean;
  headline_priority: number;
  headline_image_url?: string;
  headline_video_url?: string;
  is_trending: boolean;
}

export interface ArticleFormData {
  title: string;
  content: string;
  category_id: number;
  sub_category_id?: number;
  author_id: number;
  image?: string;
  video?: string;
  published_at?: string;
  is_featured: boolean;
  headline_priority: number;
  headline_image_url?: string;
  headline_video_url?: string;
  is_trending: boolean;
}

export interface Tag {
  id: number;
  name: string;
  description?: string;
  color?: string;
  created_at: string;
  updated_at: string;
}

export interface TagFormData {
  name: string;
  description?: string;
  color?: string;
}

export interface Comment {
  id: number;
  article_id: number;
  user_id: number;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Like {
  id: number;
  article_id: number;
  user_id: number;
  created_at: string;
}

export interface Share {
  id: number;
  article_id: number;
  user_id: number;
  platform: string;
  created_at: string;
}

export interface Bookmark {
  id: number;
  article_id: number;
  user_id: number;
  created_at: string;
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
  created_at: string;
  updated_at: string;
}

export interface SponsorFormData {
  name: string;
  contact_email?: string;
  contact_phone?: string;
  website_url?: string;
  image_url?: string;
  video_url?: string;
  description?: string;
}

export interface Video {
  id: number;
  article_id: number;
  video_url: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  article_title?: string;
}

export interface VideoFormData {
  article_id: number;
  video_url: string;
  description?: string;
}

export interface Image {
  id: number;
  article_id: number;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface ImageFormData {
  article_id: number;
  image_url: string;
}

export interface ArticleTag {
  article_id: number;
  tag_id: number;
  created_at: string;
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
  image_url: string | null;
  video_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdvertisementFormData {
  sponsor_id: number;
  article_id: number;
  category_id: number;
  start_date: string;
  end_date: string;
  ad_type: string;
  ad_content: string;
  image_url?: string;
  video_url?: string;
}

export interface AdvertisementWithDetails extends Advertisement {
  sponsor: Sponsor;
  article: Article;
  category: Category;
}

export interface TableProps<T> {
  data: T[];
  columns: {
    header: string;
    accessor: keyof T;
    cell?: (value: T[keyof T]) => React.ReactNode;
  }[];
  itemsPerPage?: number;
}
